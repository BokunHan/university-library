import DashboardClient from "@/app/admin/client";
import { getAllBorrowRequests } from "@/lib/admin/actions/borrowRequest";
import { getAllBooks } from "@/lib/admin/actions/book";
import { getAccountRequests } from "@/lib/admin/actions/user";
import { getDashboardStats } from "@/lib/admin/actions/dashboard";

const Page = async () => {
  const [dashboardStats, borrowRequests, allBooks, accountRequests] =
    await Promise.all([
      await getDashboardStats(),
      await getAllBorrowRequests(10, 0),
      await getAllBooks(20, 0),
      await getAccountRequests(10, 0),
    ]);

  return (
    <DashboardClient
      dashboardStats={dashboardStats}
      borrowRequests={borrowRequests}
      allBooks={allBooks}
      accountRequests={accountRequests}
    />
  );
};
export default Page;
