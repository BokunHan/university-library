"use client";

import { cn } from "@/lib/utils";
import { User } from "@/types";
import {
  DropDownButtonComponent,
  ItemModel,
} from "@syncfusion/ej2-react-splitbuttons";
import { useState } from "react";
import { changeUserRole } from "@/lib/admin/actions/user";

type CustomItemModel = ItemModel & {
  bgColor: string;
  dotColor: string;
  textColor: string;
  value: string;
};

const UserRoleDropDown = ({ data }: { data: User }) => {
  const [user, setUser] = useState<User>(data);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangeRole = async (role: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      const updatedUser = await changeUserRole(user.id, role);
      setUser(updatedUser);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error occurred while changing user role",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const items: CustomItemModel[] = [
    {
      bgColor: "bg-pink-50",
      dotColor: "bg-pink-500",
      textColor: "text-pink-700",
      value: "USER",
    },
    {
      bgColor: "bg-success-50",
      dotColor: "bg-success-500",
      textColor: "text-success-700",
      value: "ADMIN",
    },
  ];

  const itemTemplate = ({
    bgColor,
    dotColor,
    textColor,
    value,
  }: {
    bgColor: string;
    dotColor: string;
    textColor: string;
    value: string;
  }) => {
    return (
      <button
        className="flex items-center"
        onClick={() => handleChangeRole(value)}
        disabled={isUpdating || value === user.role.toString()}
      >
        <article className={"status-column justify-start " + bgColor}>
          <div className={"size-1.5 ml-2 rounded-full " + dotColor} />

          <h3 className={"font-inter text-xs font-medium " + textColor}>
            {value}
          </h3>
        </article>
        {value === user.role.toString() && (
          <p className="ml-8 text-dark-100">✔</p>
        )}
      </button>
    );
  };

  return (
    <div>
      <DropDownButtonComponent
        cssClass="no-arrow-button custom-dropdown"
        items={items}
        itemTemplate={itemTemplate}
      >
        <article
          className={cn(
            "status-column",
            user.role.toString() === "ADMIN" ? "bg-success-50" : "bg-pink-50",
          )}
        >
          <div
            className={cn(
              "size-1.5 rounded-full",
              user.role.toString() === "ADMIN"
                ? "bg-success-500"
                : "bg-pink-500",
            )}
          />
          <h3
            className={cn(
              "font-inter text-xs font-medium",
              user.role.toString() === "ADMIN"
                ? "text-success-700"
                : "text-pink-500",
            )}
          >
            {user.role.toString()}
          </h3>
        </article>
      </DropDownButtonComponent>
    </div>
  );
};
export default UserRoleDropDown;
