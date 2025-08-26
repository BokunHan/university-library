import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Book } from "@/types";

interface Props extends Book {
  recordId: string;
  borrowDate: string;
  daysLeft: number;
}

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  recordId,
  borrowDate,
  daysLeft,
}: Props) => (
  <li className={cn(recordId && "xs:w-52 w-full")}>
    <Link
      href={`/books/${id}`}
      className={cn(recordId && "w-full flex flex-col")}
    >
      <BookCover coverColor={coverColor} coverUrl={coverUrl} />
      <div className={cn("mt-4", !recordId && "xs:max-w-40 max-w-28")}>
        <p className="book-title">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>
    </Link>

    {recordId && (
      <div className="mt-3 w-full">
        <div className="book-loaned">
          <Image
            src="/icons/calendar.svg"
            alt="calendar"
            width={18}
            height={18}
            className="object-contain"
          />
          <p className={cn(daysLeft > 0 ? "text-light-100" : "text-pink-100")}>
            {daysLeft > 0 ? `${daysLeft} days left to return` : "overdue"}
          </p>
        </div>

        <Link href={`/api/receipts/${recordId}`} download>
          <Button className="book-btn">
            <p className="font-bebas-neue text-xl text-dark-100">
              Download receipt
            </p>
          </Button>
        </Link>
      </div>
    )}
  </li>
);
export default BookCard;
