import { User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import React from "react";

const UserCard = ({ user }: { user: User }) => {
  return (
    <article className="user-card">
      <Avatar className="w-12 h-12">
        <AvatarFallback className="bg-amber-100">
          <span className="font-serif font-semibold text-lg">
            {getInitials(user.fullName || "IN")}
          </span>
        </AvatarFallback>
      </Avatar>
      <p className="name">{user.fullName}</p>
      <p className="email">{user.email}</p>
    </article>
  );
};
export default UserCard;
