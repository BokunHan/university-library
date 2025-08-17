import React from "react";
import { Book, ColumnConfig, DialogConfig } from "@/types";
import BookCover from "@/components/BookCover";

export const getBooksTableColumns = ({
  handleDeleteBook,
}: {
  handleDeleteBook: (book: Book) => Promise<void>;
}): ColumnConfig<Book>[] => {
  const deleteBookDialogConfig: DialogConfig<Book> = {
    icon: "/icons/admin/alert.svg",
    header: "Delete Book",
    description:
      "Deleting this book will permanently erase all of the detail information and borrow records.",
    buttonBgColor: "#F46F70",
    buttonText: "Delete This Book",
    onConfirm: handleDeleteBook,
    renderItem: (book) => (
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
    ),
  };

  const bookTableColumns: ColumnConfig<Book>[] = [
    {
      header: "Book Title",
      type: "book",
      width: "300",
    },
    {
      field: "author",
      header: "Author",
      type: "text",
      width: "200",
    },
    {
      field: "genre",
      header: "Genre",
      type: "text",
      width: "150",
    },
    {
      field: "createdAt",
      header: "Date Created",
      type: "date",
      width: "120",
    },
    {
      header: "Actions",
      type: "actions",
      width: "120",
      actions: [
        {
          buttonType: "icon",
          icon: "/icons/admin/edit.svg",
          iconSize: 20,
          link: (book: Book) => `/admin/books/edit/${book.id}`,
        },
        {
          buttonType: "icon",
          icon: "/icons/admin/trash.svg",
          iconSize: 20,
          dialog: deleteBookDialogConfig,
        },
      ],
    },
  ];

  return bookTableColumns;
};
