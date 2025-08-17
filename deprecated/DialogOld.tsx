import { DialogComponent } from "@syncfusion/ej2-react-popups";
import React, { useEffect, useState } from "react";
import { Book, User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import BookCover from "@/components/BookCover";

interface DialogProps {
  user?: User;
  book?: Book;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: string;
  header: string;
  description: string;
  buttonBgColor: string;
  buttonText: string;
}

const DialogOld = ({
  user,
  book,
  isOpen,
  onClose,
  onConfirm,
  icon,
  header,
  description,
  buttonBgColor,
  buttonText,
}: DialogProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  /*   In Next.js, components are often pre-rendered on the server to generate the
   initial HTML. The server environment doesn't have browser-specific objects like
   window or document. These only become available when the JavaScript code runs
   in the user's browser.
       Your code target={document.body} is trying to access document during that
   initial server render, causing the error: document is not defined.
       The safest and most common way to fix this is to use a combination of
   useState and useEffect to track whether the component has successfully "mounted"
   on the client.
   */

  return (
    <DialogComponent
      width="500px"
      height={user === undefined && book === undefined ? "338px" : "398px"}
      isModal={true}
      target={document.body}
      visible={isOpen}
      close={onClose}
      overlayClick={onClose}
      cssClass="custom-dialog"
    >
      <div className="flex flex-col items-center justify-center">
        <button className="absolute top-7 right-7" onClick={onClose}>
          <img
            src="/icons/admin/close.svg"
            alt="close"
            width={15}
            height={15}
          />
        </button>
        <img src={icon} alt="icon" width={110} height={110} className="mt-1" />
        <span className="text-xl font-semibold text-dark-400 mt-5">
          {header}
        </span>
        {user !== undefined && (
          <div className="flex items-center gap-2 mt-5 mb-2">
            <Avatar>
              <AvatarFallback className="bg-amber-100">
                {getInitials(user.fullName || "IN")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold text-dark-200">{user.fullName}</p>
              <p className="text-light-500 text-xs">{user.email}</p>
            </div>
          </div>
        )}

        {book !== undefined && (
          <div className="flex items-center gap-2 mt-5 mb-2 w-1/2">
            <div className="w-[28.95px]">
              <BookCover
                variant="extraSmall"
                coverColor={book.coverColor}
                coverUrl={book.coverUrl}
              />
            </div>
            <p className="font-semibold text-dark-200 truncate">{book.title}</p>
          </div>
        )}

        <span className="text-base text-center text-gray-200 px-8 mt-3 leading-6">
          {description}
        </span>
        <button
          className="confirm-btn mt-4"
          style={{ backgroundColor: buttonBgColor }}
          onClick={onConfirm}
        >
          {buttonText}
        </button>
      </div>
    </DialogComponent>
  );
};
export default DialogOld;
