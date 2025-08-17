import React from "react";
import { Book, BorrowRequest, DashboardStats, User } from "@/types";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";
import BookStripe from "@/components/admin/BookStripe";
import UserCard from "@/components/admin/UserCard";
import BookCover from "@/components/BookCover";
import { cn, simpleDate } from "@/lib/utils";

const DashboardClient = ({
  dashboardStats,
  borrowRequests,
  allBooks,
  accountRequests,
}: {
  dashboardStats: DashboardStats;
  borrowRequests: BorrowRequest[];
  allBooks: Book[];
  accountRequests: User[];
}) => {
  return (
    <main className="w-full">
      <section className="stat-info flex flex-col md:flex-row gap-3 mb-3 md:mb-6">
        <StatsCard
          headerTitle="Borrowed Books"
          total={dashboardStats.totalBorrows}
          lastMonthCount={dashboardStats.booksBorrowed.lastMonth}
          currentMonthCount={dashboardStats.booksBorrowed.currentMonth}
        />
        <StatsCard
          headerTitle="Total Users"
          total={dashboardStats.totalUsers}
          lastMonthCount={dashboardStats.usersJoined.lastMonth}
          currentMonthCount={dashboardStats.usersJoined.currentMonth}
        />
        <StatsCard
          headerTitle="Total Books"
          total={dashboardStats.totalBooks}
          lastMonthCount={dashboardStats.booksCreated.lastMonth}
          currentMonthCount={dashboardStats.booksCreated.currentMonth}
        />
      </section>

      <section className="flex gap-3 flex-col lg:flex-row">
        <section className="flex flex-col lg:w-1/2">
          <div className="relative mb-3 md:mb-6">
            <div className="stat pb-1 flex flex-col relative">
              <div
                className={cn(
                  "flex items-center justify-between mb-2 md:mb-0",
                  borrowRequests.length === 0 &&
                    " absolute top-0 left-0 right-0 p-5",
                )}
              >
                <h3 className="text-xl text-dark-400 font-semibold font-ibm-plex-sans">
                  Borrow Requests
                </h3>
                <Link href="/admin/borrow-requests">
                  <button className="view-btn w-[76px] h-[36px] text-sm font-ibm-plex-sans font-semibold">
                    View all
                  </button>
                </Link>
              </div>

              {borrowRequests.length > 0 ? (
                <div className="flex flex-col gap-3 h-[350px] overflow-y-auto scrollbar-hide">
                  {borrowRequests.map((request, i) => (
                    <BookStripe key={i} request={request} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 h-[386px]">
                  <img
                    src="/icons/admin/no-borrow-request.svg"
                    alt="no borrow request"
                    width={193}
                    height={144}
                  />
                  <h3 className="text-base text-dark-400 font-semibold font-ibm-plex-sans">
                    No Pending Book Requests
                  </h3>
                  <p className="text-sm text-gray-200 font-normal font-ibm-plex-sans">
                    There are no borrow book requests awaiting your review at
                    this time.
                  </p>
                </div>
              )}
            </div>

            {borrowRequests.length > 0 && <div className="fade" />}
          </div>

          <div className="relative">
            <div className="stat pb-1 flex flex-col relative">
              <div
                className={cn(
                  "flex items-center justify-between",
                  accountRequests.length === 0 &&
                    " absolute top-0 left-0 right-0 p-5",
                )}
              >
                <h3 className="text-xl text-dark-400 font-semibold font-ibm-plex-sans">
                  Account Requests
                </h3>
                <Link href="/admin/account-requests">
                  <button className="view-btn w-[76px] h-[36px] text-sm font-ibm-plex-sans font-semibold">
                    View all
                  </button>
                </Link>
              </div>

              {accountRequests.length > 0 ? (
                <div className="flex flex-col gap-3 h-[300px] overflow-y-auto scrollbar-hide mt-[35px]">
                  {accountRequests.map((request, i) => (
                    <UserCard key={i} user={request} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-center justify-center h-[336px]">
                  <img
                    src="/icons/admin/no-account-request.svg"
                    alt="no account request"
                    width={193}
                    height={144}
                  />
                  <h3 className="text-base text-dark-400 font-semibold font-ibm-plex-sans">
                    No Pending Account Requests
                  </h3>
                  <p className="text-sm text-gray-200 font-normal font-ibm-plex-sans">
                    There are currently no account requests awaiting approval.
                  </p>
                </div>
              )}
            </div>

            {accountRequests.length > 0 && <div className="fade" />}
          </div>
        </section>

        <section className="flex flex-col">
          <div className="relative">
            <div className="stat pb-1 flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-dark-400 font-semibold font-ibm-plex-sans">
                  Recently Added Books
                </h3>
                <Link href="/admin/books">
                  <button className="view-btn w-[76px] h-[36px] text-sm font-ibm-plex-sans font-semibold">
                    View all
                  </button>
                </Link>
              </div>

              <Link href="/admin/books/new" className="add-new-book_btn">
                <div>
                  <img
                    src="/icons/admin/plus.svg"
                    alt="plus"
                    width={18}
                    height={18}
                  />
                </div>
                <p>Add New Book</p>
              </Link>

              <div className="flex flex-col gap-5 h-[654px] overflow-y-auto scrollbar-hide">
                {allBooks.map((book, i) => (
                  <article key={i} className="book-stripe bg-white p-1">
                    <div className="flex gap-3.5">
                      <div className="w-[55px]">
                        <BookCover
                          variant="small"
                          coverColor={book.coverColor}
                          coverUrl={book.coverUrl}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <p className="title">{book.title}</p>
                        <div className="author">
                          <p>By {book.author}</p>
                          <div />
                          <p>{book.genre}</p>
                        </div>
                        <div className="borrow-date">
                          <img
                            src="/icons/admin/calendar.svg"
                            alt="calendar"
                            width={16}
                            height={16}
                          />
                          <p>{simpleDate(book.createdAt?.toString() || "")}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="fade" />
          </div>
        </section>
      </section>
    </main>
  );
};
export default DashboardClient;
