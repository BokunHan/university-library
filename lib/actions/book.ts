"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { BorrowBookParams } from "@/types";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ title: books.title, availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const bookTitle = book[0].title;
    const borrowDate = dayjs().toDate().toDateString();
    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const [record] = await db
      .insert(borrowRecords)
      .values({
        userId,
        bookId,
        dueDate,
        status: "Borrowed",
      })
      .returning();

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    const [user] = await db
      .select({ email: users.email, fullName: users.fullName })
      .from(users)
      .where(eq(users.id, userId));

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/borrowing`,
      body: {
        recordId: record.id,
        email: user.email,
        fullName: user.fullName,
        bookTitle,
        borrowDate,
        dueDate,
      },
    });

    return {
      success: true,
      data: record,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};
