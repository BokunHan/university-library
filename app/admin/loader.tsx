"use client";

import dynamic from "next/dynamic";
import { Book, BorrowRequest, DashboardStats, User } from "@/types";

const DashboardClient = dynamic(() => import("@/app/admin/client"), {
  ssr: false,
  loading: () => <p className="p-5">Loading Dashboard...</p>,
});

export default function DashboardLoader({
  dashboardStats,
  borrowRequests,
  allBooks,
  accountRequests,
}: {
  dashboardStats: DashboardStats;
  borrowRequests: BorrowRequest[];
  allBooks: Book[];
  accountRequests: User[];
}) {
  return (
    <DashboardClient
      dashboardStats={dashboardStats}
      borrowRequests={borrowRequests}
      allBooks={allBooks}
      accountRequests={accountRequests}
    />
  );
}
