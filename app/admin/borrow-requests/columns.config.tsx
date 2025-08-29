import { Book, BorrowRequest, ColumnConfig, DropDownItemModel } from "@/types";
import { redirect } from "next/navigation";
import DownloadReceipt from "@/components/DownloadReceipt";

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
          template: (request: BorrowRequest) => (
            <DownloadReceipt
              key={request.id}
              id={request.id}
              className="book-receipt_admin-btn"
              loaderType="dark"
            >
              <div className="flex justify-center items-center gap-1">
                <img
                  src="/icons/admin/receipt.svg"
                  alt="receipt"
                  width="16"
                  height="16"
                />
                <p className="font-semibold text-xs leading-4 font-ibm-plex-sans text-[rgb(37_56_140)]">
                  Generate
                </p>
              </div>
            </DownloadReceipt>
          ),
        },
      ],
    },
  ];
  return borrowRequestTableColumns;
};
