import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Book } from "@/types";
import DownloadReceipt from "@/components/DownloadReceipt";

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
  <li className="borrowed-book relative">
    {daysLeft <= 0 && (
      <Image
        src="/icons/warning.svg"
        alt="warning"
        width={29}
        height={29}
        className="absolute top-0 left-0"
      />
    )}

    <Link href={`/books/${id}`} className="flex flex-col">
      <div
        className="flex items-center justify-center w-[240px] h-[247px] rounded-[10px]"
        style={{ backgroundColor: `${coverColor}4D` }}
      >
        <BookCover
          variant="medium"
          coverColor={coverColor}
          coverUrl={coverUrl}
        />
      </div>
    </Link>
    <div className="flex flex-col justify-start w-full h-full">
      <p className="book-title">{title}</p>
      <p className="book-genre">{genre}</p>
    </div>

    <div className="mt-4 w-full flex flex-col gap-2">
      <div className="book-loaned">
        <Image
          src="/icons/book-2.svg"
          alt="book"
          width={18}
          height={18}
          className="object-contain"
        />
        <p className="text-light-100">{`Borrowed on ${borrowDate}`}</p>
      </div>

      <div className="book-loaned justify-between">
        <div className="flex gap-1">
          <Image
            src={daysLeft > 0 ? "/icons/calendar.svg" : "/icons/warning.svg"}
            alt={daysLeft > 0 ? "calendar" : "warning"}
            width={18}
            height={18}
            className="object-contain"
          />
          <p className={cn(daysLeft > 0 ? "text-light-100" : "text-red-300")}>
            {daysLeft > 0 ? `${daysLeft} days left to due` : "Overdue Return"}
          </p>
        </div>

        <DownloadReceipt
          id={recordId}
          className="flex items-center justify-center w-[26px] h-[26px] rounded-[4px]"
          style={{ backgroundColor: `${coverColor}4D` }}
        >
          <Image
            src="/icons/receipt.svg"
            alt="receipt"
            width={16}
            height={16}
          />
        </DownloadReceipt>
        {/*<Link*/}
        {/*  href={`/api/receipts/${recordId}`}*/}
        {/*  download*/}
        {/*  className="flex items-center justify-center w-[26px] h-[26px] rounded-[4px]"*/}
        {/*  style={{ backgroundColor: `${coverColor}4D` }}*/}
        {/*>*/}
        {/*  <Image*/}
        {/*    src="/icons/receipt.svg"*/}
        {/*    alt="receipt"*/}
        {/*    width={16}*/}
        {/*    height={16}*/}
        {/*  />*/}
        {/*</Link>*/}
      </div>
    </div>
  </li>
);
export default BookCard;
