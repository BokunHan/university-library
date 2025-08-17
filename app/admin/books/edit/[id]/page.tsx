import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookForm from "@/components/admin/forms/BookForm";
import { getBookById } from "@/lib/admin/actions/book";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) throw new Error("Book not found");

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <BookForm type="update" {...book} />
      </section>
    </>
  );
};
export default Page;
