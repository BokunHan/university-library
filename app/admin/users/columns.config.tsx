import React from "react";
import {
  ColumnConfig,
  DialogConfig,
  DropDownItemModel,
  EnrichedUser,
  User,
} from "@/types";
import config from "@/lib/config";
import UserInfo from "@/components/admin/UserInfo";

export const getUsersTableColumns = ({
  handleDeleteUser,
  handleChangeRole,
}: {
  handleDeleteUser: (user: User) => Promise<void>;
  handleChangeRole: (
    user: EnrichedUser,
    item: DropDownItemModel<EnrichedUser>,
  ) => Promise<EnrichedUser>;
}): ColumnConfig<EnrichedUser>[] => {
  const deleteUserDialogConfig: DialogConfig<User> = {
    icon: "/icons/admin/alert.svg",
    header: "Delete User Account",
    description:
      "Deleting this account will permanently erase all of the borrow\n" +
      "          records and personal information.",
    buttonBgColor: "#F46F70",
    buttonText: "Delete & Notify User",
    onConfirm: handleDeleteUser,
    renderItem: (user) => <UserInfo user={user} />,
  };

  const changeRoleDropDownItems: DropDownItemModel<EnrichedUser>[] = [
    {
      bgColor: "bg-pink-50",
      dotColor: "bg-pink-500",
      textColor: "text-pink-700",
      width: "65px",
      value: "USER",
      onClick: handleChangeRole,
    },
    {
      bgColor: "bg-success-50",
      dotColor: "bg-success-500",
      textColor: "text-success-700",
      width: "65px",
      value: "ADMIN",
      onClick: handleChangeRole,
    },
  ];

  const usersTableColumns: ColumnConfig<EnrichedUser>[] = [
    {
      header: "Name",
      type: "user",
      width: "250",
    },
    {
      field: "createdAt",
      header: "Date Joined",
      type: "date",
      width: "100",
    },
    {
      field: "role",
      header: "Role",
      type: "dropdown",
      dropDownItems: changeRoleDropDownItems,
      width: "100",
    },
    {
      field: "borrowCount",
      header: "Books Borrowed",
      type: "text",
      width: "120",
    },
    {
      field: "universityId",
      header: "University Id No",
      type: "text",
      width: "120",
    },
    {
      field: "universityCard",
      header: "University ID",
      type: "image",
      width: "150",
      linkPrefix: config.env.imagekit.urlEndpoint,
      linkText: "View ID Card",
      icon: "/icons/admin/link.svg",
      iconSize: 14,
    },
    {
      header: "Actions",
      type: "actions",
      width: "120",
      actions: [
        {
          buttonType: "icon",
          icon: "/icons/admin/trash.svg",
          iconSize: 18,
          dialog: deleteUserDialogConfig,
        },
      ],
    },
  ];

  return usersTableColumns;
};
