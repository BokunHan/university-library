"use client";

import { Button } from "@/components/ui/button";
import BookCover from "@/components/BookCover";
import { simpleDate } from "@/lib/utils";
import BookVideo from "@/components/BookVideo";
import { Book } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const BookDetail = ({ book }: { book: Book }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleBack = () => {
    if (from === "update" || from === "create") {
      router.push("/admin/books");
    } else {
      router.back();
    }
  };

  return (
    <main className="flex flex-col">
      <section>
        <Button className="back-btn" onClick={handleBack}>
          <img
            src="/icons/admin/arrow-left.svg"
            alt="arrow-left"
            width={18}
            height={18}
          />
          <p className="font-ibm-plex-sans">Go back</p>
        </Button>
      </section>

      <section className="book-illustration">
        <div className="flex gap-5">
          <div
            className="flex items-center justify-center w-[290px] h-[260px] rounded-xl"
            style={{ backgroundColor: book.coverColor + "20" }}
          >
            <BookCover
              variant="medium"
              coverColor={book.coverColor}
              coverUrl={book.coverUrl}
            />
          </div>
        </div>

        <div className="relative flex flex-col justify-center gap-4">
          <div className="flex items-center">
            <p className="text-lg font-normal font-ibm-plex-sans text-gray-200 mr-4">
              Created at:
            </p>
            <img
              src="/icons/admin/calendar-2.svg"
              alt="calendar"
              width={20}
              height={20}
            />
            <p className="text-base font-normal font-ibm-plex-sans text-dark-200 ml-2">
              {simpleDate(book.createdAt?.toDateString() || "")}
            </p>
          </div>
          <p className="text-2xl font-semibold font-ibm-plex-sans text-dark-400">
            {book.title}
          </p>
          <p className="text-lg font-semibold font-ibm-plex-sans text-dark-200">
            By {book.author}
          </p>
          <p className="text-base font-normal font-ibm-plex-sans text-gray-200">
            {book.genre}
          </p>
          <Button className="book-form_btn">
            <img
              src="/icons/admin/edit-2.svg"
              alt="edit"
              width={16}
              height={16}
            />
            <p className="text-white text-sm font-bold font-ibm-plex-sans">
              Edit Book
            </p>
          </Button>
        </div>
      </section>

      <section className="book-illustration items-start mt-10">
        <div className="flex flex-col gap-4 lg:w-3/5">
          <p className="text-base font-semibold font-ibm-plex-sans text-dark-400">
            Summary
          </p>
          <div className="text-base font-normal font-ibm-plex-sans text-gray-200">
            {book.summary.split("\n").map((line, i) => (
              <p key={i} className="mb-6">
                {line}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:w-2/5">
          <p className="text-base font-semibold font-ibm-plex-sans text-dark-400">
            Video
          </p>
          <BookVideo videoUrl={book.videoUrl} />
        </div>
      </section>
    </main>
  );
};
export default BookDetail;
