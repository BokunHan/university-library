import BorrowRequestsClient from "@/app/admin/borrow-requests/client";
import { getAllBorrowRequests } from "@/lib/admin/actions/borrowRequest";

const Page = async () => {
  const allRequests = (await getAllBorrowRequests(10, 0)) || [];

  return (
    <main className="all-users wrapper h-full relative">
      <header className="mx-5 mt-6 absolute">
        <p className="text-xl font-bold text-dark-400">Borrow Book Requests</p>
      </header>
      <div className="mx-5 h-full">
        <BorrowRequestsClient allRequests={allRequests} />
      </div>
    </main>
  );
};
export default Page;
