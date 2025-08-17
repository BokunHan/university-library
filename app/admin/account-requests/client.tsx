"use client";

import {
  approveAccountRequest,
  rejectAccountRequest,
} from "@/lib/admin/actions/user";
import { User } from "@/types";
import React, { useCallback, useMemo, useState } from "react";
import Table from "@/components/admin/Table";
import Dialog from "@/components/admin/Dialog";
import { getAccountRequestsTableColumns } from "@/app/admin/account-requests/columns.config";

const AccountRequestsClient = ({ requestUsers }: { requestUsers: User[] }) => {
  const [users, setUsers] = useState<User[]>(requestUsers);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    config: null as any,
    item: null as User | null,
  });

  // 2. HANDLER FUNCTIONS
  const handleRowUpdate = useCallback((updatedUser: User) => {
    setUsers((users) =>
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
  }, []);

  const handleRowAction = useCallback((item: User, action: any) => {
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

    setUsers((users) =>
      users.filter((user) => user.id !== dialogState.item!.id),
    );

    handleDialogClose();
  }, [dialogState.item, dialogState.config, handleDialogClose]);

  const handleApproval = async (user: User) => {
    try {
      if (user === undefined) return;
      await approveAccountRequest(user.id);
    } catch (error) {
      console.log("Failed to approve user", error);
    }
  };

  const handleRejection = async (user: User) => {
    try {
      if (user === undefined) return;
      await rejectAccountRequest(user.id);
    } catch (error) {
      console.log("Failed to reject user", error);
    }
  };

  const columnConfig = useMemo(
    () => getAccountRequestsTableColumns({ handleApproval, handleRejection }),
    [handleApproval, handleRejection],
  );

  return (
    <main className="h-full">
      {users.length > 0 ? (
        <div className="mt-[72px]">
          <Table
            data={users}
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
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center h-full">
          <img
            src="/icons/admin/no-account-request.svg"
            alt="no account request"
            width={193}
            height={144}
          />
          <h3 className="text-base text-dark-400 font-semibold font-ibm-plex-sans">
            No Pending Account Requests
          </h3>
          <p className="text-sm text-gray-200 font-normal font-ibm-plex-sans">
            There are currently no account requests awaiting approval.
          </p>
        </div>
      )}
    </main>
  );
};
export default AccountRequestsClient;
