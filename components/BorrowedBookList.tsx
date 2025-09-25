import React from "react";
import BorrowedBookCard from "@/components/BorrowedBookCard";
import { BookItem } from "@/types";

interface Props {
  title: string;
  bookItems: BookItem[];
}

const BorrowedBookList = ({ title, bookItems }: Props) => {
  return (
    <section className="flex flex-col xl:flex-row gap-20">
      {bookItems.length > 0 && (
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-3xl font-semibold text-light-100">{title}</h2>

          <ul className="borrowed-book-list justify-center sm:justify-start">
            {bookItems.map((item, i) => (
              <BorrowedBookCard
                key={i}
                {...item.book}
                recordId={item.recordId}
                borrowDate={item.borrowDate}
                daysLeft={item.daysLeft}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
export default BorrowedBookList;
