"use client";

import { DialogComponent } from "@syncfusion/ej2-react-popups";
import React, { useEffect, useState } from "react";

// 1. Define the generic props interface
interface DialogProps<T> {
  item?: T; // The generic item (could be a User, Book, etc.)
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: string;
  header: string;
  description: string;
  buttonBgColor: string;
  buttonText: string;
  // A function to render the specific details of the item
  renderItem?: (item: T) => React.ReactNode;
}

// 2. Make the component generic with `<T extends object>`
const Dialog = <T extends object>({
  item,
  isOpen,
  onClose,
  onConfirm,
  icon,
  header,
  description,
  buttonBgColor,
  buttonText,
  renderItem, // The new render prop
}: DialogProps<T>) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <DialogComponent
      // Adjust height based on whether an item is being rendered
      height={item && renderItem ? "398px" : "338px"}
      width="500px"
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

        {/* 3. Use the renderItem function to display the item's details */}
        {item && renderItem && (
          <div className="flex items-center justify-center gap-2 mt-5 mb-2 w-full">
            {renderItem(item)}
          </div>
        )}

        <span className="text-base text-center text-gray-200 px-8 mt-3 leading-6">
          {description}
        </span>
        <button
          className="confirm-btn mt-4"
          style={{ backgroundColor: buttonBgColor }}
          onClick={() => {
            setIsLoading(true);
            onConfirm();
          }}
          disabled={isLoading}
        >
          {isLoading && (
            <img
              src="/icons/admin/loader.svg"
              className="size-5 animate-spin"
            />
          )}
          {isLoading ? " Proceeding..." : buttonText}
        </button>
      </div>
    </DialogComponent>
  );
};

export default Dialog;
