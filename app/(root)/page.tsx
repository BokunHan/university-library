import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";

const Home = async () => {
  const session = await auth();
  if (!session?.user?.id) return;

  // const user = await db
  //   .select()
  //   .from(users)
  //   .where(eq(users.id, session?.user?.id))
  //   .limit(1);
  // if (user.length === 1) {
  //   await sendEmail({
  //     email: user[0].email,
  //     type: "inactive-3",
  //     fullName: user[0].fullName,
  //   });
  // }

  const latestBooks = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(10);

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
