"use client";

import { changeUserRole, deleteUser } from "@/lib/admin/actions/user";
import { DropDownItemModel, User } from "@/types";
import React, { useCallback, useMemo, useState } from "react";
import Table from "@/components/admin/Table";
import Dialog from "@/components/admin/Dialog";
import { getUsersTableColumns } from "@/app/admin/users/columns.config";
import { toast } from "react-hot-toast";

const AllUsersClient = ({ allUsers }: { allUsers: User[] }) => {
  const [users, setUsers] = useState<User[]>(allUsers);
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

  const handleDeleteUser = useCallback(async (user: User) => {
    try {
      if (user === undefined) return;
      await deleteUser(user.id);
      toast.success("User deleted successfully.");
    } catch (error) {
      console.log("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  }, []);

  const handleChangeRole = useCallback(
    async (data: User, item: DropDownItemModel<User>) => {
      try {
        const updatedUser = (await changeUserRole(data.id, item.value)) as User;
        toast.success("User role changed successfully.");
        return updatedUser;
      } catch (error) {
        console.log(error);
        toast.error("Failed to change user role");
        throw error;
      }
    },
    [],
  );

  const columnConfig = useMemo(
    () => getUsersTableColumns({ handleDeleteUser, handleChangeRole }),
    [handleDeleteUser, handleDeleteUser],
  );

  return (
    <>
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
    </>
  );
};
export default AllUsersClient;
