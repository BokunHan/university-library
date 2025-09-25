"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { BookParams } from "@/types";
import { revalidateTag } from "next/cache";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    revalidateTag("books-collection");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async (id: string, params: BookParams) => {
  try {
    const newBook = await db
      .update(books)
      .set({
        ...params,
      })
      .where(eq(books.id, id))
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const getAllBooks = async (limit: number, offset: number) => {
  try {
    const allBooks = await db
      .select()
      .from(books)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(books.createdAt));

    return allBooks;
  } catch (error) {
    console.error("Failed to get all books", error);
    throw error;
  }
};

export const getBookById = async (id: string) => {
  try {
    const book = await db.select().from(books).where(eq(books.id, id)).limit(1);

    if (book.length === 0) throw new Error("Book not found");

    return book[0];
  } catch (error) {
    console.error("Failed to get book", error);
  }
};

export const deleteBook = async (id: string) => {
  // try {
  //   await db.delete(books).where(eq(books.id, id));
  // } catch (error) {
  //   console.log("Failed to delete book", error);
  // }
};
