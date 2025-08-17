import { ColumnConfig, DialogConfig, DropDownItemModel, User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import config from "@/lib/config";
import UserInfo from "@/components/admin/UserInfo";

export const getAccountRequestsTableColumns = ({
  handleApproval,
  handleRejection,
}: {
  handleApproval: (user: User) => Promise<void>;
  handleRejection: (user: User) => Promise<void>;
}): ColumnConfig<User>[] => {
  const approvalDialogConfig: DialogConfig<User> = {
    icon: "/icons/admin/success.svg",
    header: "Approve Account Request",
    description:
      "Approve the student's account request and grant access. A confirmation email will be sent upon approval.",
    buttonBgColor: "#4C7B62",
    buttonText: "Approve & Send Confirmation",
    onConfirm: handleApproval,
    renderItem: (
      user, // How to render a user
    ) => <UserInfo user={user} />,
  };

  const rejectionDialogConfig: DialogConfig<User> = {
    icon: "/icons/admin/alert.svg",
    header: "Deny Account Request",
    description:
      "Denying this request will notify the student they're not eligible due to unsuccessful ID card verification.",
    buttonBgColor: "#F46F70",
    buttonText: "Deny & Notify Student",
    onConfirm: handleRejection,
    renderItem: (
      user, // How to render a user
    ) => <UserInfo user={user} />,
  };

  const requestTableColumns: ColumnConfig<User>[] = [
    {
      header: "Name",
      type: "user",
      width: "300",
    },
    {
      field: "createdAt",
      header: "Date Joined",
      type: "date",
      width: "120",
    },
    {
      field: "universityId",
      header: "University Id No",
      type: "text",
      width: "150",
    },
    {
      field: "universityCard",
      header: "University ID",
      type: "image",
      width: "150",
      linkPrefix: config.env.imagekit.urlEndpoint,
      linkText: "View ID Card",
      icon: "/icons/admin/eye-2.svg",
      iconSize: 16,
    },
    {
      field: "id",
      header: "Actions",
      type: "actions",
      width: "220",
      actions: [
        {
          buttonType: "text",
          text:
            '<div style=" display: flex; justify-content: center; ' +
            "align-items: center; background-color: rgb(236 253 243); width: 135px; " +
            'height: 36px; border-radius: 6px;"><p style="font-weight: 600; ' +
            "font-size: 0.75rem; line-height: 1rem; font-family: IBM Plex Sans, sans-serif; " +
            'color: rgb(2 122 72);">Approve Account</p></div>',
          dialog: approvalDialogConfig,
        },
        {
          buttonType: "icon",
          icon: "/icons/admin/close-circle.svg",
          iconSize: 20,
          dialog: rejectionDialogConfig,
        },
      ],
    },
  ];

  return requestTableColumns;
};
