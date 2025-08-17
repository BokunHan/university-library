import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import React from "react";
import { User } from "@/types";

const UserInfo = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-10 h-10">
        <AvatarFallback className="bg-amber-100">
          <span className="font-serif font-semibold text-sm">
            {getInitials(user.fullName || "IN")}
          </span>
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-semibold font-ibm-plex-sans text-sm text-dark-200">
          {user.fullName}
        </p>
        <p className="text-gray-200 text-xs font-ibm-plex-sans">{user.email}</p>
      </div>
    </div>
  );
};
export default UserInfo;
