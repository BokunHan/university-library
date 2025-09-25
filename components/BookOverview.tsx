import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import { Book, User } from "@/types";
import Link from "next/link";
import DownloadReceipt from "@/components/DownloadReceipt";

interface Props {
  book: Book;
  user: User;
  recordId?: string;
}

const BookOverview = ({ book, user, recordId }: Props) => {
  const borrowingEligibility = {
    isEligible: book.availableCopies > 0, //&& user.status === "APPROVED",
    message:
      book.availableCopies <= 0
        ? "Book is not available"
        : "You are not eligible to borrow this book",
  };

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{book.title}</h1>

        <div className="book-info">
          <p>
            By{" "}
            <span className="font-semibold text-light-200">{book.author}</span>
          </p>

          <p>
            Category:{" "}
            <span className="font-semibold text-light-200">{book.genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p className="text-light-200">{book.rating}</p>/5
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books: <span>{book.totalCopies}</span>
          </p>

          <p>
            Available Books: <span>{book.availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{book.description}</p>

        {recordId ? (
          <DownloadReceipt id={recordId} variant="default" />
        ) : (
          <BorrowBook
            bookId={book.id}
            userId={user.id}
            borrowingEligibility={borrowingEligibility}
          />
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <Link href={`/books/${book.id}`}>
          <div className="relative">
            <BookCover
              variant="wide"
              className="z-10"
              coverColor={book.coverColor}
              coverUrl={book.coverUrl}
              priority={true}
            />

            <div className="absolute left-36 top-8 rotate-12 opacity-40 max-sm:hidden">
              <BookCover
                variant="wide"
                coverColor={book.coverColor}
                coverUrl={book.coverUrl}
                isBlurred={true}
                priority={true}
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
export default BookOverview;
