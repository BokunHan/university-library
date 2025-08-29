import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book } from "@/types";
import { getAllBooks } from "@/lib/admin/actions/book";
import AllBooksClient from "@/app/admin/books/client";

const Page = async () => {
  const allBooks = (await getAllBooks(10, 0)) as Book[];

  return (
    <section className="w-full rounded-2xl bg-white p-6 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button className="new-book_btn" variant="default" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <AllBooksClient allBooks={allBooks} />
    </section>
  );
};
export default Page;
