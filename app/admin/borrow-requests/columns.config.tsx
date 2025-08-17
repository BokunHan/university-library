import { Book, BorrowRequest, ColumnConfig, DropDownItemModel } from "@/types";
import { redirect } from "next/navigation";

export const getBorrowRequestTableColumns = (
  handleChangeStatus: (
    data: BorrowRequest,
    item: DropDownItemModel<BorrowRequest>,
  ) => Promise<any>,
): ColumnConfig<BorrowRequest>[] => {
  const borrowStatusDropDownItems: DropDownItemModel<BorrowRequest>[] = [
    {
      bgColor: "bg-primary-50",
      dotColor: "bg-primary-700",
      textColor: "text-primary-700",
      width: "90px",
      value: "Borrowed",
      onClick: handleChangeStatus,
    },
    {
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-700",
      textColor: "text-blue-700",
      width: "90px",
      value: "Returned",
      onClick: handleChangeStatus,
    },
    {
      bgColor: "bg-rose-50",
      dotColor: "bg-rose-700",
      textColor: "text-rose-700",
      width: "90px",
      value: "Late Return",
      onClick: handleChangeStatus,
    },
  ];

  const borrowRequestTableColumns: ColumnConfig<BorrowRequest>[] = [
    {
      header: "Book",
      type: "book",
      linkField: "bookId",
      width: "300",
    },
    {
      header: "User Requested",
      type: "user",
      width: "200",
    },
    {
      field: "status",
      header: "Status",
      type: "dropdown",
      dropDownItems: borrowStatusDropDownItems,
      dropDownWidth: "160px",
      width: "150",
    },
    {
      field: "borrowDate",
      header: "Borrowed Date",
      type: "date",
      width: "120",
    },
    {
      field: "returnDate",
      header: "Return Date",
      type: "date",
      width: "120",
    },
    {
      field: "dueDate",
      header: "Due Date",
      type: "date",
      width: "120",
    },
    {
      header: "Receipt",
      type: "actions",
      width: "120",
      actions: [
        {
          buttonType: "text",
          text:
            '<div style="display: flex; justify-content: center; gap: 0.25rem; ' +
            "align-items: center; background-color: rgb(248 248 255); width: 104px; " +
            'height: 36px; border-radius: 6px;"><img src="/icons/admin/receipt.svg" alt="receipt" ' +
            'width="16" height="16" /><p style="font-weight: 600; ' +
            "font-size: 0.75rem; line-height: 1rem; font-family: IBM Plex Sans, sans-serif; " +
            'color: rgb(37 56 140);">Generate</p></Link>',
          onClick: (request: BorrowRequest) =>
            redirect(`/admin/books/receipt/${request.id}`),
        },
      ],
    },
  ];
  return borrowRequestTableColumns;
};
