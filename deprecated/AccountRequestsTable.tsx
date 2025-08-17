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
import {
  approveAccountRequest,
  rejectAccountRequest,
} from "@/lib/admin/actions/user";
import Dialog from "@/components/admin/Dialog";

type DialogType = "approve" | "reject" | null;
type DialogConfig = Omit<
  React.ComponentProps<typeof Dialog<User>>,
  "isOpen" | "onClose" | "onConfirm" | "item"
>;

const AllUsersTable = ({ dataSource }: { dataSource: User[] }) => {
  const [currentData, setCurrentData] = useState<User[]>(dataSource);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [userRequesting, setUserRequesting] = useState<User | undefined>(
    undefined,
  );

  const openDialog = (user: User, config: DialogConfig) => {
    setUserRequesting(user);
    setDialogConfig(config);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setDialogType(null);
      setDialogConfig(null);
      setUserRequesting(undefined);
    }, 300);
  };

  const handleRejection = async () => {
    try {
      if (userRequesting === undefined) return;
      await rejectAccountRequest(userRequesting.id);

      setCurrentData((currentData) =>
        currentData.filter((data) => data.id !== userRequesting.id),
      );
    } catch (error) {
      console.log("Failed to reject user", error);
    } finally {
      closeDialog();
    }
  };

  const handleApproval = async () => {
    try {
      if (userRequesting === undefined) return;
      await approveAccountRequest(userRequesting.id);

      setCurrentData((currentData) =>
        currentData.filter((data) => data.id !== userRequesting.id),
      );
    } catch (error) {
      console.log("Failed to approve user", error);
    } finally {
      closeDialog();
    }
  };

  const userAvatarTemplate = (user: User) => {
    return (
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
    );
  };

  const approvalDialogConfig: DialogConfig = {
    icon: "/icons/admin/success.svg",
    header: "Approve Account Request",
    description:
      "Approve the student's account request and grant access. A confirmation email will be sent upon approval.",
    buttonBgColor: "#4C7B62",
    buttonText: "Approve & Send Confirmation",
    renderItem: (
      user, // How to render a user
    ) => userAvatarTemplate(user),
  };

  const rejectionDialogConfig: DialogConfig = {
    icon: "/icons/admin/alert.svg",
    header: "Deny Account Request",
    description:
      "Denying this request will notify the student they're not eligible due to unsuccessful ID card verification.",
    buttonBgColor: "#F46F70",
    buttonText: "Deny & Notify Student",
    renderItem: (
      user, // Same render function, but could be different
    ) => userAvatarTemplate(user),
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
            width="300"
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
            width="120"
            textAlign="Left"
            template={({ createdAt }: { createdAt: Date }) => (
              <p className="font-semibold text-dark-200">
                {formatDate(createdAt?.toISOString() || "")}
              </p>
            )}
          />
          <ColumnDirective
            field="universityId"
            headerText="University ID No"
            headerTextAlign="Left"
            width="150"
            textAlign="Left"
            template={({ universityId }: { universityId: string }) => (
              <p className="font-semibold text-dark-200">{universityId}</p>
            )}
          />
          <ColumnDirective
            field="universityIdCard"
            headerText="University ID Card"
            headerTextAlign="Left"
            width="150"
            textAlign="Left"
            template={({ universityIdCard }: { universityIdCard: string }) => (
              <Link
                href={config.env.imagekit.urlEndpoint + universityIdCard}
                className="flex items-center gap-1 font-semibold text-blue-100"
              >
                <img
                  src="/icons/admin/eye-2.svg"
                  alt="link"
                  width={16}
                  height={16}
                />
                View ID Card
              </Link>
            )}
          />
          <ColumnDirective
            field="action"
            headerText="Actions"
            headerTextAlign="Left"
            width="220"
            textAlign="Left"
            template={(user: User) => (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => {
                    setDialogType("approve");
                    openDialog(user, approvalDialogConfig);
                  }}
                >
                  <div className="approve-btn">
                    <p className="font-semibold text-xs font-ibm-plex-sans text-success-700">
                      Approve Account
                    </p>
                  </div>
                </button>
                <button
                  className="flex items-center justify-start"
                  onClick={() => {
                    setDialogType("reject");
                    openDialog(user, rejectionDialogConfig);
                  }}
                >
                  <img
                    src="/icons/admin/close-circle.svg"
                    alt="trash"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            )}
          />
        </ColumnsDirective>
      </GridComponent>

      {dialogConfig && dialogType === "approve" && (
        <Dialog
          item={userRequesting}
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onConfirm={handleApproval}
          {...dialogConfig}
        />
      )}

      {dialogConfig && dialogType === "reject" && (
        <Dialog
          item={userRequesting}
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onConfirm={handleRejection}
          {...dialogConfig}
        />
      )}
    </div>
  );
};
export default AllUsersTable;
