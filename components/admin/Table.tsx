import React from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { ActionConfig, ColumnConfig } from "@/types";
import { formatDate, isUser } from "@/lib/utils";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import DropDown from "@/components/admin/DropDown";
import UserInfo from "@/components/admin/UserInfo";

interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowUpdate: (updatedItem: T) => void; // Callback for dropdown changes
  onRowAction: (item: T, action: any) => void; // Callback for button clicks
}

const Table = <T extends { [key: string]: any }>({
  data,
  columns,
  onRowUpdate,
  onRowAction,
}: TableProps<T>) => {
  const renderTemplate = (column: ColumnConfig<T>) => (props: T) => {
    switch (column.type) {
      case "user":
        if (isUser(props)) {
          return <UserInfo user={props} />;
        }
        return;

      case "book":
        const linkId = column.linkField ? props[column.linkField] : props.id;
        return (
          <Link href={`/admin/books/${linkId}`}>
            <div className="flex items-center gap-2">
              <div className="w-[28.95px]">
                <BookCover
                  variant="extraSmall"
                  coverColor={props.coverColor}
                  coverUrl={props.coverUrl}
                />
              </div>
              <p className="text-sm font-semibold font-ibm-plex-sans text-dark-400 truncate">
                {props.title}
              </p>
            </div>
          </Link>
        );

      case "date":
        return (
          <p className="font-medium font-ibm-plex-sans text-dark-200">
            {props[column.field] &&
              (typeof props[column.field] === "string"
                ? formatDate(props[column.field])
                : formatDate(props[column.field].toISOString()))}
          </p>
        );

      case "image":
        return (
          <Link
            href={column.linkPrefix + props[column.field]}
            className="flex items-center gap-1.5 font-medium font-ibm-plex-sans text-blue-100"
          >
            {column.linkText}
            <img
              src={column.icon}
              alt="icon"
              width={column.iconSize}
              height={column.iconSize}
            />
          </Link>
        );

      case "component": {
        const { Component } = column;
        if (!Component) return null;
        return <Component data={props} />;
      }

      case "dropdown": {
        if (!column.dropDownItems) return null;
        return (
          <DropDown
            data={props}
            items={column.dropDownItems}
            valueKey={column.field}
            dropDownWidth={column.dropDownWidth!}
            onUpdate={onRowUpdate}
          />
        );
      }

      case "actions":
        return (
          <div className="flex items-center gap-5">
            {column.actions?.map((action: ActionConfig<T>, index) => {
              let buttonContent;
              if (action.buttonType === "text" && action.text) {
                buttonContent = action.text;
              }

              if (action.buttonType === "icon" && action.icon) {
                buttonContent = `<img
                    src=${action.icon}
                    alt="icon"
                    width=${action.iconSize || 14}
                    height=${action.iconSize || 14} />`;
              }

              if (action.link) {
                return (
                  <Link key={index} href={action.link(props)}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: buttonContent!,
                      }}
                    />
                  </Link>
                );
              } else {
                return (
                  <button
                    key={index}
                    onClick={() => onRowAction(props, action)}
                    title={action.tooltip}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: buttonContent!,
                      }}
                    />
                  </button>
                );
              }
            })}
          </div>
        );
      // ... other cases
      default:
        return (
          <p className="text-dark-200 font-medium font-ibm-plex-sans truncate">
            {props[column.field]}
          </p>
        );
    }
  };

  return (
    <div>
      <GridComponent
        dataSource={data}
        gridLines="None"
        className="no-outer-border light-header custom-header custom-cell"
      >
        <ColumnsDirective>
          {columns.map((col, index) => (
            <ColumnDirective
              key={index}
              field={col.field as string}
              headerText={col.header}
              width={col.width}
              template={renderTemplate(col)}
              headerTextAlign="Left"
              textAlign="Left"
            />
          ))}
        </ColumnsDirective>
      </GridComponent>
    </div>
  );
};

export default Table;
