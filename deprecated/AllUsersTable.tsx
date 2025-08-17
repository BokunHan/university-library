"use client";

import React, { useState } from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { User } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";
import Link from "next/link";
import config from "@/lib/config";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UserRoleDropDown from "@/deprecated/UserRoleDropDown";
import { deleteUser } from "@/lib/admin/actions/user";
import Dialog from "@/components/admin/Dialog";

interface UserAndBorrowCount {
  user: User;
  borrowCount: number;
}

type DialogConfig = Omit<
  React.ComponentProps<typeof Dialog<User>>,
  "isOpen" | "onClose" | "onConfirm" | "item"
>;

const AllUsersTable = ({
  dataSource,
}: {
  //dataSource: UserAndBorrowCount[];
  dataSource: User[];
}) => {
  const [currentData, setCurrentData] = useState<User[]>(dataSource);
  //useState<UserAndBorrowCount[]>(dataSource);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [userDeleting, setUserDeleting] = useState<User | undefined>(undefined);

  const openDialog = (user: User, config: DialogConfig) => {
    setUserDeleting(user);
    setDialogConfig(config);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setDialogConfig(null);
      setUserDeleting(undefined);
    }, 300);
  };

  const deleteUserDialogConfig: DialogConfig = {
    icon: "/icons/admin/alert.svg",
    header: "Delete User Account",
    description:
      "Deleting this account will permanently erase all of the borrow\n" +
      "          records and personal information.",
    buttonBgColor: "#F46F70",
    buttonText: "Delete & Notify User",
    renderItem: (
      user, // How to render a user
    ) => (
      <>
        <Avatar>
          <AvatarFallback className="bg-amber-100">
            {getInitials(user.fullName || "IN")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold text-dark-200">{user.fullName}</p>
          <p className="text-light-500 text-xs">{user.email}</p>
        </div>
      </>
    ),
  };

  const handleDeleteUser = async () => {
    try {
      if (userDeleting === undefined) return;
      await deleteUser(userDeleting.id);

      setCurrentData((currentData) =>
        currentData.filter((data) => data.id !== userDeleting.id),
      );
    } catch (error) {
      console.log("Failed to delete user", error);
    } finally {
      closeDialog();
    }
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
            field="name"
            headerText="Name"
            headerTextAlign="Left"
            width="250"
            textAlign="Left"
            template={({
              fullName,
              email,
            }: {
              fullName: string;
              email: string;
            }) => (
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-amber-100">
                    <span className="font-serif font-semibold text-sm">
                      {getInitials(fullName || "IN")}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold font-ibm-plex-sans text-sm text-dark-200">
                    {fullName}
                  </p>
                  <p className="text-light-500 text-sm font-ibm-plex-sans">
                    {email}
                  </p>
                </div>
              </div>
            )}
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            headerTextAlign="Left"
            width="100"
            textAlign="Left"
            template={({ createdAt }: { createdAt: Date }) => (
              <p className="font-semibold text-dark-200">
                {formatDate(createdAt?.toISOString() || "")}
              </p>
            )}
          />
          <ColumnDirective
            field="role"
            headerText="Role"
            width="100"
            textAlign="Left"
            template={(user: User) => <UserRoleDropDown data={user} />}
          />
          {/*<ColumnDirective*/}
          {/*  field="booksBorrowed"*/}
          {/*  headerText="Books Borrowed"*/}
          {/*  headerTextAlign="Left"*/}
          {/*  width="120"*/}
          {/*  textAlign="Left"*/}
          {/*  template={({ borrowCount }: { borrowCount: number }) => (*/}
          {/*    <p className="font-semibold text-dark-200">{borrowCount}</p>*/}
          {/*  )}*/}
          {/*/>*/}
          <ColumnDirective
            field="universityId"
            headerText="University ID No"
            headerTextAlign="Left"
            width="120"
            textAlign="Left"
            template={({ universityId }: { universityId: string }) => (
              <p className="font-semibold text-dark-200">{universityId}</p>
            )}
          />
          <ColumnDirective
            field="universityIdCard"
            headerText="University ID Card"
            headerTextAlign="Left"
            width="130"
            textAlign="Left"
            template={({ universityCard }: { universityCard: string }) => (
              <Link
                href={config.env.imagekit.urlEndpoint + universityCard}
                className="flex items-center gap-1.5 font-semibold text-blue-100"
              >
                View ID Card
                <img
                  src="/icons/admin/link.svg"
                  alt="link"
                  width={12}
                  height={12}
                />
              </Link>
            )}
          />
          <ColumnDirective
            field="action"
            headerText="Action"
            headerTextAlign="Right"
            width="60"
            textAlign="Right"
            template={(user: User) => (
              <button
                className="flex items-center justify-start"
                onClick={() => openDialog(user, deleteUserDialogConfig)}
              >
                <img
                  src="/icons/admin/trash.svg"
                  alt="trash"
                  width={18}
                  height={18}
                />
              </button>
            )}
          />
        </ColumnsDirective>
      </GridComponent>

      {dialogConfig && (
        <Dialog
          item={userDeleting}
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onConfirm={handleDeleteUser}
          {...dialogConfig}
        />
      )}
    </div>
  );
};
export default AllUsersTable;
