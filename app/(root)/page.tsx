import { unstable_cache as cache } from "next/cache";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { auth } from "@/auth";
import { and, desc, eq } from "drizzle-orm";
import dynamic from "next/dynamic";

const BookList = dynamic(() => import("@/components/BookList"));

const getCachedLatestBooks = cache(
  async () => {
    return db.select().from(books).orderBy(desc(books.createdAt)).limit(7);
  },
  ["latest-books"], // This is a unique key for this cache entry
  {
    revalidate: 3600, // Cache the result for one hour
    tags: ["books-collection"], // unique tag used for revalidate in createBook
  },
);

const Home = async () => {
  // 1. Start all independent data fetches at the same time
  const sessionPromise = auth();
  const latestBooksPromise = getCachedLatestBooks();

  // 2. Wait for them to complete in parallel
  const [session, latestBooks] = await Promise.all([
    sessionPromise,
    latestBooksPromise,
  ]);

  if (!session?.user?.id) {
    // Note: The auth() check in your layout already handles the redirect.
    // This is just a safeguard.
    return null;
  }

  const userId = session.user.id;
  const featuredBook = latestBooks[0];

  // 3. Fetch data that DEPENDS on the first fetches (like the borrow record)
  // This is a small, final query.
  const recordPromise = db
    .select()
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, featuredBook.id),
        eq(borrowRecords.status, "Borrowed"),
      ),
    );

  // We can fetch the user details here once, instead of in every component.
  const userPromise = db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const [record, [user]] = await Promise.all([recordPromise, userPromise]);

  if (!featuredBook || !user) return <p>No books available.</p>;

  return (
    <>
      <BookOverview book={featuredBook} user={user} recordId={record[0]?.id} />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
