"use client";

import { Book } from "@/types";
import React, { useState } from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import BookCover from "@/components/BookCover";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { deleteBook } from "@/lib/admin/actions/book";
import Dialog from "@/components/admin/Dialog";

type DialogConfig = Omit<
  React.ComponentProps<typeof Dialog<Book>>,
  "isOpen" | "onClose" | "onConfirm" | "item"
>;

const AllBooksTable = ({ dataSource }: { dataSource: Book[] }) => {
  const [currentData, setCurrentData] = useState<Book[]>(dataSource);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [bookDeleting, setBookDeleting] = useState<Book | undefined>(undefined);

  const openDialog = (book: Book, config: DialogConfig) => {
    setBookDeleting(book);
    setDialogConfig(config);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setDialogConfig(null);
      setBookDeleting(undefined);
    }, 300);
  };

  const handleDeleteBook = async () => {
    try {
      if (bookDeleting === undefined) return;
      await deleteBook(bookDeleting.id);

      setCurrentData((currentData) =>
        currentData.filter((data) => data.id !== bookDeleting.id),
      );
    } catch (error) {
      console.log("Failed to delete book", error);
    } finally {
      closeDialog();
    }
  };

  const deleteBookDialogConfig: DialogConfig = {
    icon: "/icons/admin/alert.svg",
    header: "Delete Book",
    description:
      "Deleting this book will permanently erase all of the detail information and borrow records.",
    buttonBgColor: "#F46F70",
    buttonText: "Delete This Book",
    renderItem: (book) => (
      <>
        <div className="w-[28.95px]">
          <BookCover
            variant="extraSmall"
            coverColor={book.coverColor}
            coverUrl={book.coverUrl}
          />
        </div>
        <p className="font-semibold text-dark-200 truncate">{book.title}</p>
      </>
    ),
  };

  const BookTitleTemplate = (book: Book) => {
    return (
      <Link href={`/admin/books/${book.id}`}>
        <div className="flex items-center gap-2">
          <div className="w-[28.95px]">
            <BookCover
              variant="extraSmall"
              coverColor={book.coverColor}
              coverUrl={book.coverUrl}
            />
          </div>
          <p className="text-sm font-semibold font-ibm-plex-sans text-dark-400 truncate">
            {book.title}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div>
      <GridComponent
        dataSource={currentData}
        gridLines="None"
        className="no-outer-border light-header custom-header custom-cell"
      >
        <ColumnsDirective>
          <ColumnDirective
            headerText="Book Title"
            headerTextAlign="Left"
            width="400"
            textAlign="Left"
            template={BookTitleTemplate}
          />
          <ColumnDirective
            field="author"
            headerText="Author"
            headerTextAlign="Left"
            width="150"
            textAlign="Left"
            template={(book: Book) => (
              <p className="text-sm font-medium font-ibm-plex-sans text-dark-200">
                {book.author}
              </p>
            )}
          />
          <ColumnDirective
            field="genre"
            headerText="Genre"
            headerTextAlign="Left"
            width="150"
            textAlign="Left"
            template={(book: Book) => (
              <p className="text-sm font-medium font-ibm-plex-sans text-dark-200">
                {book.genre}
              </p>
            )}
          />
          <ColumnDirective
            field="createdAt"
            headerText="Date Created"
            headerTextAlign="Left"
            width="150"
            textAlign="Left"
            template={(book: Book) => (
              <p className="text-sm font-medium font-ibm-plex-sans text-dark-200">
                {formatDate(book.createdAt?.toISOString() || "")}
              </p>
            )}
          />
          <ColumnDirective
            headerText="Action"
            headerTextAlign="Left"
            width="120"
            textAlign="Left"
            template={(book: Book) => (
              <div className="flex items-center gap-4">
                <Link href={`/admin/books/edit/${book.id}`}>
                  <img
                    src="/icons/admin/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                </Link>
                <button
                  onClick={() => openDialog(book, deleteBookDialogConfig)}
                >
                  <img
                    src="/icons/admin/trash.svg"
                    alt="trash"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            )}
          />
        </ColumnsDirective>
      </GridComponent>

      {dialogConfig && (
        <Dialog
          item={bookDeleting}
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onConfirm={handleDeleteBook}
          {...dialogConfig}
        />
      )}
    </div>
  );
};
export default AllBooksTable;
