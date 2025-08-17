import React from "react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

const Page = async () => {
  const session = await auth();
  if (!session || !session.user) return null;
  const borrowedBookIds = await db
    .select({ bookId: borrowRecords.bookId })
    .from(borrowRecords)
    .where(eq(borrowRecords.userId, session.user.id as string))
    .orderBy(desc(borrowRecords.borrowDate));

  const borrowedBooks = [];

  for (const bookId of borrowedBookIds) {
    const borrowedBook = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId.bookId))
      .limit(1);
    borrowedBooks.push(borrowedBook[0]);
  }

  return (
    <>
      <BookList title="Borrowed Books" books={borrowedBooks} my_books={true} />
    </>
  );
};
export default Page;
