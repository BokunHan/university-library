"use client";

import { Book } from "@/types";
import React, { useCallback, useMemo, useState } from "react";
import Table from "@/components/admin/Table";
import { deleteBook } from "@/lib/admin/actions/book";
import Dialog from "@/components/admin/Dialog";
import { getBooksTableColumns } from "@/app/admin/books/columns.config";

const AllBooksClient = ({ allBooks }: { allBooks: Book[] }) => {
  const [books, setBooks] = useState<Book[]>(allBooks);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    config: null as any,
    item: null as Book | null,
  });

  // 2. HANDLER FUNCTIONS
  const handleRowUpdate = useCallback((updatedBook: Book) => {
    setBooks((books) =>
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book)),
    );
  }, []);

  const handleRowAction = useCallback((item: Book, action: any) => {
    if (action.dialog) {
      setDialogState({ isOpen: true, item, config: action.dialog });
    } else if (action.onClick) {
      action.onClick(item);
    }
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogState({ isOpen: false, item: null, config: null });
  }, []);

  const handleDialogConfirm = useCallback(async () => {
    if (!dialogState.item || !dialogState.config) return;

    await dialogState.config.onConfirm(dialogState.item);

    setBooks((books) =>
      books.filter((book) => book.id !== dialogState.item!.id),
    );

    handleDialogClose();
  }, [dialogState.item, dialogState.config, handleDialogClose]);

  const handleDeleteBook = async (book: Book) => {
    try {
      if (book === undefined) return;
      await deleteBook(book.id);
    } catch (error) {
      console.log("Failed to delete book", error);
    }
  };

  const columnConfig = useMemo(
    () => getBooksTableColumns({ handleDeleteBook }),
    [handleDeleteBook],
  );

  return (
    <>
      <Table
        data={books}
        columns={columnConfig}
        onRowUpdate={handleRowUpdate}
        onRowAction={handleRowAction}
      />

      {dialogState.isOpen && dialogState.config && (
        <Dialog
          isOpen={dialogState.isOpen}
          item={dialogState.item!}
          onClose={handleDialogClose}
          onConfirm={handleDialogConfirm}
          header={dialogState.config.header}
          description={dialogState.config.description}
          icon={dialogState.config.icon}
          buttonText={dialogState.config.buttonText}
          buttonBgColor={dialogState.config.buttonBgColor}
          renderItem={dialogState.config.renderItem}
        />
      )}
    </>
  );
};
export default AllBooksClient;
