import { getAllUsers, getBorrowCounts } from "@/lib/admin/actions/user";
import React from "react";
import AllUsersClient from "./client";
import { EnrichedUser } from "@/types";

const Page = async () => {
  const [users, borrowCounts] = await Promise.all([
    getAllUsers(),
    getBorrowCounts(),
  ]);

  const borrowCountMap = new Map(
    borrowCounts.map((item) => [item.userId, item.count]),
  );

  const enrichedUsers = users.map((user) => ({
    ...user,
    borrowCount: borrowCountMap.get(user.id) || 0,
  })) as EnrichedUser[];

  return (
    <main className="all-users wrapper">
      <header className="mx-5 mt-6">
        <p className="text-xl font-bold text-dark-400">All Users</p>
      </header>
      <div className="mx-5">
        <AllUsersClient allUsers={enrichedUsers} />
      </div>
    </main>
  );
};
export default Page;
