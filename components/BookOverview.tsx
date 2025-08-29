import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import { db } from "@/database/drizzle";
import { borrowRecords, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { Book } from "@/types";
import Link from "next/link";
import DownloadReceipt from "@/components/DownloadReceipt";

interface Props extends Book {
  userId: string;
}

const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
}: Props) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  const borrowingEligibility = {
    isEligible: availableCopies > 0, //&& user.status === "APPROVED",
    message:
      availableCopies <= 0
        ? "Book is not available"
        : "You are not eligible to borrow this book",
  };

  const [record] = await db
    .select()
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, id),
        eq(borrowRecords.status, "Borrowed"),
      ),
    );

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category:{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p className="text-light-200">{rating}</p>/5
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books: <span>{totalCopies}</span>
          </p>

          <p>
            Available Books: <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        {record ? (
          <DownloadReceipt id={record.id} variant="default" />
        ) : (
          <BorrowBook
            bookId={id}
            userId={userId}
            borrowingEligibility={borrowingEligibility}
          />
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <Link href={`/books/${id}`}>
          <div className="relative">
            <BookCover
              variant="wide"
              className="z-10"
              coverColor={coverColor}
              coverUrl={coverUrl}
            />

            <div className="absolute left-36 top-8 rotate-12 opacity-40 max-sm:hidden">
              <BookCover
                variant="wide"
                coverColor={coverColor}
                coverUrl={coverUrl}
                isBlurred={true}
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
export default BookOverview;
