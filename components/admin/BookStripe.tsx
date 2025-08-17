import { BorrowRequest } from "@/types";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, simpleDate } from "@/lib/utils";
import React from "react";

const BookStripe = ({ request }: { request: BorrowRequest }) => {
  return (
    <article className="book-stripe justify-between">
      <div className="flex items-center gap-3.5">
        <div className="w-[55px]">
          <BookCover
            variant="small"
            coverColor={request.coverColor}
            coverUrl={request.coverUrl}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="title">{request.title}</p>
          <div className="author">
            <p>By {request.author}</p>
            <div />
            <p>{request.genre}</p>
          </div>
          <div className="user">
            <div className="avatar">
              <Avatar className="w-[18px] h-[18px]">
                <AvatarFallback className="bg-amber-100">
                  <span className="font-serif font-semibold text-[8px]">
                    {getInitials(request.fullName || "IN")}
                  </span>
                </AvatarFallback>
              </Avatar>
              <p>{request.fullName}</p>
            </div>
            <div className="borrow-date">
              <img
                src="/icons/admin/calendar.svg"
                alt="calendar"
                width={16}
                height={16}
              />
              <p>{simpleDate(request.borrowDate.toString())}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <Link
          href="/admin/borrow-requests"
          className="flex items-center justify-center bg-white rounded-xl w-[32px] h-[32px]"
        >
          <img
            src="/icons/admin/eye-2.svg"
            alt="eye"
            width="20px"
            height="20px"
          />
        </Link>
      </div>
    </article>
  );
};
export default BookStripe;
