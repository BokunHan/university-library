import React from "react";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import BorrowedBookList from "@/components/BorrowedBookList";
import { calculateDaysLeft } from "@/lib/utils";
import { BookItem } from "@/types";
import dayjs from "dayjs";
import ProfilePanel from "@/components/ProfilePanel";

const Page = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return null;
  const userId = session.user.id;

  const userPromise = db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const borrowedItemsPromise = db.query.borrowRecords.findMany({
    where: eq(borrowRecords.userId, userId),
    orderBy: desc(borrowRecords.borrowDate),
    with: {
      book: true, // This tells Drizzle to JOIN and include the full book object
    },
  });

  const [user, borrowedItems] = await Promise.all([
    userPromise,
    borrowedItemsPromise,
  ]);

  if (!user) return null;

  const bookItems: BookItem[] = borrowedItems.map((item) => ({
    // The book object is already attached, no extra query needed
    book: item.book,
    recordId: item.id,
    borrowDate: dayjs(item.borrowDate).format("MMM DD, YYYY"),
    daysLeft: calculateDaysLeft(item.dueDate),
  }));

  return (
    <section className="flex flex-col xl:flex-row gap-20">
      <div className="w-1/2">
        <ProfilePanel user={user} />
      </div>

      <BorrowedBookList title="Borrowed Books" bookItems={bookItems} />
    </section>
  );
};
export default Page;
