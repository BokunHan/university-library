import { db } from "@/database/drizzle";
import React from "react";
import { books, borrowRecords, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BookOverview from "@/components/BookOverview";
import { auth } from "@/auth";
import BookVideo from "@/components/BookVideo";
import BookCover from "@/components/BookCover";
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const sessionPromise = auth();
  const bookDetailsPromise = db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  const [session, [bookDetails]] = await Promise.all([
    sessionPromise,
    bookDetailsPromise,
  ]);

  if (!session?.user?.id) return;
  const userId = session.user.id;

  if (!bookDetails) redirect("/404");

  const similarBooksPromise = db
    .select({
      id: books.id,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
    })
    .from(books)
    .where(eq(books.genre, bookDetails.genre))
    .limit(6);

  const userPromise = db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const recordPromise = db
    .select()
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, id),
        eq(borrowRecords.status, "Borrowed"),
      ),
    );

  const [similarBooks, [user], record] = await Promise.all([
    similarBooksPromise,
    userPromise,
    recordPromise,
  ]);

  return (
    <>
      <BookOverview
        book={bookDetails}
        user={user}
        recordId={record[0]?.id || ""}
      />

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
