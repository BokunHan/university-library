import { getAllBorrowRequests } from "@/lib/admin/actions/borrowRequest";
import { getAllBooks } from "@/lib/admin/actions/book";
import { getAccountRequests } from "@/lib/admin/actions/user";
import { getDashboardStats } from "@/lib/admin/actions/dashboard";
import DashboardLoader from "@/app/admin/loader";

const Page = async () => {
  const [dashboardStats, borrowRequests, allBooks, accountRequests] =
    await Promise.all([
      getDashboardStats(),
      getAllBorrowRequests(10, 0),
      getAllBooks(20, 0),
      getAccountRequests(10, 0),
    ]);

  return (
    <DashboardLoader
      dashboardStats={dashboardStats}
      borrowRequests={borrowRequests}
      allBooks={allBooks}
      accountRequests={accountRequests}
    />
  );
};
export default Page;
