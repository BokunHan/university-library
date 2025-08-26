import React from "react";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import BorrowedBookList from "@/components/BorrowedBookList";
import { calculateDaysLeft } from "@/lib/utils";
import { BookItem } from "@/types";
import dayjs from "dayjs";

const Page = async () => {
  const session = await auth();
  if (!session || !session.user) return null;
  const borrowedBookInfo = await db
    .select({
      recordId: borrowRecords.id,
      bookId: borrowRecords.bookId,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
    })
    .from(borrowRecords)
    .where(eq(borrowRecords.userId, session.user.id as string))
    .orderBy(desc(borrowRecords.borrowDate));

  const BookItems = [];

  for (const info of borrowedBookInfo) {
    const borrowedBook = await db
      .select()
      .from(books)
      .where(eq(books.id, info.bookId))
      .limit(1);

    BookItems.push({
      book: borrowedBook[0],
      recordId: info.recordId,
      borrowDate: dayjs(info.borrowDate).format("MMMM DD, YY"),
      daysLeft: calculateDaysLeft(info.dueDate),
    } as BookItem);
  }

  return (
    <>
      <BorrowedBookList title="Borrowed Books" bookItems={BookItems} />
    </>
  );
};
export default Page;
