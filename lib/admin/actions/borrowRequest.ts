"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { BorrowRequest, BorrowStatus } from "@/types";
import dayjs from "dayjs";
import { sendEmail } from "@/lib/workflow";

export const getAllBorrowRequests = async (limit: number, offset: number) => {
  try {
    const allRequests = (await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
        fullName: users.fullName,
        email: users.email,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverColor: books.coverColor,
        coverUrl: books.coverUrl,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(borrowRecords.borrowDate))) as BorrowRequest[];

    return allRequests;
  } catch (error) {
    console.error("Failed to get all borrow records", error);
    throw error;
  }
};

export const getBorrowRequestById = async (id: string) => {
  try {
    const request = (await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
        fullName: users.fullName,
        email: users.email,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverColor: books.coverColor,
        coverUrl: books.coverUrl,
      })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .limit(1)) as BorrowRequest[];

    return request[0];
  } catch (error) {
    console.error("Failed to get all borrow records", error);
    throw error;
  }
};

export const changeStatus = async (
  id: string,
  bookId: string,
  status: BorrowStatus,
) => {
  try {
    if (status === "Borrowed") {
      await db
        .update(borrowRecords)
        .set({ returnDate: null })
        .where(
          and(isNotNull(borrowRecords.returnDate), eq(borrowRecords.id, id)),
        );

      await db
        .update(books)
        .set({ availableCopies: sql`${books.availableCopies} - 1` })
        .where(eq(books.id, bookId));
    } else if (status === "Returned" || status === "Late Return") {
      await db
        .update(borrowRecords)
        .set({ returnDate: dayjs().toDate().toDateString() })
        .where(and(isNull(borrowRecords.returnDate), eq(borrowRecords.id, id)));

      const record = await db
        .select({ status: borrowRecords.status })
        .from(borrowRecords)
        .where(eq(borrowRecords.id, id))
        .limit(1);

      if (record && record.length > 0 && record[0].status === "Borrowed") {
        await db
          .update(books)
          .set({ availableCopies: sql`${books.availableCopies} + 1` })
          .where(eq(books.id, bookId));
      }

      if (status === "Returned") {
        const user = await db
          .select({
            email: users.email,
            fullName: users.fullName,
            title: books.title,
          })
          .from(borrowRecords)
          .where(eq(borrowRecords.id, id))
          .innerJoin(users, eq(borrowRecords.userId, users.id))
          .innerJoin(books, eq(borrowRecords.bookId, books.id));

        if (user.length === 1) {
          await sendEmail({
            email: user[0].email,
            type: "return",
            fullName: user[0].fullName,
            bookTitle: user[0].title,
          });
        }
      }
    }

    const updatedRequest = await db
      .update(borrowRecords)
      .set({ status: status as BorrowStatus })
      .where(eq(borrowRecords.id, id))
      .returning();

    if (updatedRequest.length === 0 || !updatedRequest[0]) {
      throw new Error("Failed to change status of borrow request");
    }

    return getBorrowRequestById(id);
  } catch (error) {
    console.error("Failed to change status of borrow request", error);
    throw error;
  }
};
