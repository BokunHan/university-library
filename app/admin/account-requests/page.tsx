import { getAccountRequests } from "@/lib/admin/actions/user";
import AccountRequestsClient from "@/app/admin/account-requests/client";
import React from "react";

const Page = async () => {
  const requestUsers = await getAccountRequests(10, 0);

  return (
    <main className="all-users wrapper h-full relative">
      <header className="mx-5 mt-6 absolute">
        <p className="text-xl font-bold text-dark-400">
          Account Registration Requests
        </p>
      </header>
      <div className="mx-5 h-full">
        <AccountRequestsClient requestUsers={requestUsers} />
      </div>
    </main>
  );
};
export default Page;
