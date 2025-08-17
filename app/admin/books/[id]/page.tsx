import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BookDetail from "@/components/admin/BookDetail";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);

  if (!book) redirect("/404");

  return <BookDetail book={book} />;
};
export default Page;
