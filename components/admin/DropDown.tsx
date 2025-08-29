"use client";

import { DropDownItemModel } from "@/types";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface DropDownProps<T> {
  data: T;
  valueKey: keyof T;
  dropDownWidth: string;
  items: DropDownItemModel<T>[];
  onUpdate: (newData: T) => void;
}

const DropDown = <T extends { [key: string]: any }>({
  data,
  valueKey,
  dropDownWidth = "150px",
  items,
  onUpdate,
}: DropDownProps<T>) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = async (item: DropDownItemModel<T>) => {
    if (isUpdating || !item.onClick) return;
    setIsUpdating(true);
    try {
      const newData = await item.onClick(data, item);
      onUpdate(newData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const activeItem = items.find((item) => item.value === data[valueKey]);

  const itemTemplate = (item: DropDownItemModel<T>) => {
    const isActive = item.value === activeItem?.value;

    return (
      <button
        className="flex items-center w-full justify-between h-9"
        onClick={() => handleSelect(item)}
        disabled={isUpdating || isActive}
      >
        <article
          className={"status-column justify-start " + item.bgColor}
          style={item?.width ? { width: item?.width } : {}}
        >
          <div className={"size-1.5 ml-2 rounded-full " + item.dotColor} />

          <h3 className={"text-xs font-medium " + item.textColor}>
            {item.value}
          </h3>
        </article>

        {isActive && <p className="text-dark-100">✔</p>}
      </button>
    );
  };

  return (
    <div>
      <DropDownButtonComponent
        cssClass={cn(
          "no-arrow-button custom-dropdown transparent-bg",
          // isUpdating && "is-updating",
        )}
        items={items}
        itemTemplate={itemTemplate}
        popupWidth={dropDownWidth}
        disabled={isUpdating}
      >
        <article
          className={cn(
            "status-column ",
            isUpdating ? "justify-center " : "justify-start ",
            activeItem?.bgColor,
          )}
          style={activeItem?.width ? { width: activeItem?.width } : {}}
        >
          {isUpdating ? (
            <img
              src="/icons/admin/loader-dark.svg"
              className="size-5 animate-spin"
            />
          ) : (
            <>
              <div
                className={"size-1.5 ml-2 rounded-full " + activeItem?.dotColor}
              />

              <h3
                className={
                  "font-inter text-xs font-medium " + activeItem?.textColor
                }
              >
                {activeItem?.value}
              </h3>
            </>
          )}
        </article>
      </DropDownButtonComponent>
    </div>
  );
};
export default DropDown;
