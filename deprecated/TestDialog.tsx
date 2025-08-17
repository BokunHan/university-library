"use client";

import React, { useState } from "react";
import { DialogComponent } from "@syncfusion/ej2-react-popups";

const TestDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log(`Component rendering, isDialogOpen = ${isDialogOpen}`);

  const openDialog = () => {
    console.log("ACTION: Opening dialog");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    console.log("ACTION: Closing dialog through button");
    setIsDialogOpen(false);
  };

  const onOverlayClick = () => {
    console.log("ACTION: Closing dialog through overlay");
    setIsDialogOpen(false);
  };

  return (
    <div>
      <button className="flex items-center justify-end" onClick={openDialog}>
        <img src="/icons/admin/trash.svg" alt="trash" width={18} height={18} />
      </button>
      <DialogComponent
        width="500px"
        height="338px"
        isModal={true}
        target={document.body}
        visible={isDialogOpen}
        close={closeDialog}
        overlayClick={onOverlayClick}
        cssClass="custom-dialog"
      >
        <div className="flex flex-col items-center justify-center relative">
          <button className="absolute top-7 right-7 z-10" onClick={closeDialog}>
            <img
              src="/icons/admin/close.svg"
              alt="close"
              width={15}
              height={15}
            />
          </button>
          <img
            src="/icons/admin/alert.svg"
            alt="alert"
            width={110}
            height={110}
            className="mt-1"
          />
          <span className="text-xl font-semibold text-dark-400 mt-5">
            Delete User Account
          </span>
          <span className="text-base text-center text-gray-200 px-8 mt-3 leading-6">
            Deleting this account will permanently erase all of your borrow
            records and personal information.
          </span>
          <button className="confirm-btn bg-red-400 mt-4">
            Delete & Notify User
          </button>
        </div>
      </DialogComponent>
    </div>
  );
};
export default TestDialog;
