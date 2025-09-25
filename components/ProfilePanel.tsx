import React from "react";
import Image from "next/image";
import { User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import config from "@/lib/config";

const baseUrl = config.env.imagekit.urlEndpoint;

const ProfilePanel = ({ user }: { user: User }) => {
  const { fullName, email, universityId, universityCard } = user;
  return (
    <div className="profile-panel relative">
      <Image
        src="/icons/profile-top.svg"
        alt="profile"
        width={59}
        height={88}
        className="absolute -top-4 left-[198px] sm:left-[253px] z-10"
      />

      <div className="flex flex-col items-center gap-9 w-full">
        <div className="flex flex-col justify-start gap-8 w-full">
          <div className="flex gap-6">
            <Avatar className="w-[99px] h-[99px] border-[10px] border-[#333C5C]/20 rounded-[200px]">
              <AvatarFallback className="bg-amber-100">
                <span className="font-serif font-semibold text-3xl">
                  {getInitials(fullName || "IN")}
                </span>
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-center gap-2 w-full">
              <div className="flex gap-1">
                <Image
                  src="/icons/verified.svg"
                  alt="verified"
                  width={18}
                  height={18}
                />
                <p className="text-sm text-light-100">Verified Student</p>
              </div>
              <p className="text-2xl font-semibold text-white line-clamp-1">
                {fullName}
              </p>
              <p className="text-base text-light-100 line-clamp-1">{email}</p>
            </div>
          </div>

          <div className="flex flex-col justify-start gap-1 w-full">
            <p className="text-lg text-light-100">University</p>
            <p className="text-2xl font-semibold text-white">BookWise</p>
          </div>

          <div className="flex flex-col justify-start gap-1 w-full">
            <p className="text-lg text-light-100">Student ID</p>
            <p className="text-2xl font-semibold text-white">{universityId}</p>
          </div>
        </div>

        <div className="w-[376px] sm:w-[486px] h-[287px] overflow-hidden">
          <Image
            src={`${baseUrl}${universityCard}`}
            alt="student-card"
            width={486}
            height={287}
            priority
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};
export default ProfilePanel;
