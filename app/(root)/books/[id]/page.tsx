import { db } from "@/database/drizzle";
import React from "react";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BookOverview from "@/components/BookOverview";
import { auth } from "@/auth";
import BookVideo from "@/components/BookVideo";
import BookCover from "@/components/BookCover";
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  const similarBooks = await db
    .select({
      id: books.id,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
    })
    .from(books)
    .where(eq(books.genre, bookDetails.genre))
    .limit(6);

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

      <div className="book-details">
        <div className="flex-[1.3]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-16 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-8 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        <div className="flex-1">
          <section className="flex flex-col gap-7">
            <h3>More similar books</h3>
            <ul className="similar-books">
              {similarBooks.map((book, i) => (
                <li key={i}>
                  <Link href={`/books/${book.id}`}>
                    <BookCover
                      variant="medium"
                      coverColor={book.coverColor}
                      coverUrl={book.coverUrl}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};
export default Page;
