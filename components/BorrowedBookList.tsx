import React from "react";
import BorrowedBookCard from "@/components/BorrowedBookCard";
import { BookItem } from "@/types";

interface Props {
  title: string;
  bookItems: BookItem[];
  containerClassName?: string;
}

const BorrowedBookList = ({ title, bookItems, containerClassName }: Props) => {
  if (bookItems.length < 1) return;
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
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
    </section>
  );
};
export default BorrowedBookList;
