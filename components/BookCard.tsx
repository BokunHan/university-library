import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { Book } from "@/types";

const BookCard = ({ id, title, genre, coverColor, coverUrl }: Book) => (
  <li>
    <Link href={`/books/${id}`}>
      <BookCover coverColor={coverColor} coverUrl={coverUrl} />
      <div className="mt-4 xs:max-w-40 max-w-28">
        <p className="book-title line-clamp-2">{title}</p>
        <p className="book-genre">{genre}</p>
      </div>
    </Link>
  </li>
);
export default BookCard;
