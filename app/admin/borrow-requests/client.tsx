"use client";

import { BorrowRequest, BorrowStatus, DropDownItemModel } from "@/types";
import React, { useCallback, useMemo, useState } from "react";
import Table from "@/components/admin/Table";
import { getBorrowRequestTableColumns } from "@/app/admin/borrow-requests/columns.config";
import { changeStatus } from "@/lib/admin/actions/borrowRequest";
import { toast } from "react-hot-toast";

const BorrowRequestsClient = ({
  allRequests,
}: {
  allRequests: BorrowRequest[];
}) => {
  // 1. STATE MANAGEMENT
  const [requests, setRequests] = useState<BorrowRequest[]>(allRequests);

  // 2. HANDLER FUNCTIONS
  const handleRowUpdate = useCallback((updatedRequest: BorrowRequest) => {
    setRequests((currentRequests) =>
      currentRequests.map((req) =>
        req.id === updatedRequest.id ? updatedRequest : req,
      ),
    );
  }, []);

  const handleRowAction = useCallback((item: BorrowRequest, action: any) => {
    action.onClick(item);
  }, []);

  const handleChangeStatus = useCallback(
    async (data: BorrowRequest, item: DropDownItemModel<BorrowRequest>) => {
      const updatedRequest = await changeStatus(
        data.id,
        item.value as BorrowStatus,
      );
      if (updatedRequest) {
        toast.success("Status changed successfully.");
        return updatedRequest;
      } else {
        toast.error("Failed to change status.");
        throw new Error("Failed to change status.");
      }
    },
    [],
  );

  const columnsConfig = useMemo(
    () => getBorrowRequestTableColumns(handleChangeStatus),
    [handleChangeStatus],
  );

  return (
    <main className="h-full">
      {requests.length === 0 ? (
        <Table
          data={requests}
          columns={columnsConfig}
          onRowUpdate={handleRowUpdate}
          onRowAction={handleRowAction}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 h-full">
          <img
            src="/icons/admin/no-borrow-request.svg"
            alt="no borrow request"
            width={193}
            height={144}
          />
          <h3 className="text-base text-dark-400 font-semibold font-ibm-plex-sans">
            No Pending Book Requests
          </h3>
          <p className="text-sm text-gray-200 font-normal font-ibm-plex-sans">
            There are no borrow book requests awaiting your review at this time.
          </p>
        </div>
      )}
    </main>
  );
};
export default BorrowRequestsClient;
