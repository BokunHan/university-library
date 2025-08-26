import { BORROW_STATUS_ENUM, ROLE_ENUM, STATUS_ENUM } from "@/database/schema";
import React from "react";
import { ItemModel } from "@syncfusion/ej2-react-splitbuttons";

interface StatsCard {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
}

interface TrendResult {
  trend: "increment" | "decrement" | "no change";
  change: number;
}

interface DashboardStats {
  totalBorrows: number;
  booksBorrowed: {
    currentMonth: number;
    lastMonth: number;
  };
  totalUsers: number;
  usersJoined: {
    currentMonth: number;
    lastMonth: number;
  };
  totalBooks: number;
  booksCreated: {
    currentMonth: number;
    lastMonth: number;
  };
}

interface Document {
  [key: string]: any;
}

type FilterByDate = (
  items: Document[],
  key: string,
  start: string,
  end?: string,
) => number;

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
  isLoanedBook?: boolean;
}

interface BookItem {
  book: Book;
  recordId: string;
  borrowDate: string;
  daysLeft: number;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: STATUS_ENUM | null;
  role: ROLE_ENUM | null;
  lastActivityDate: string | null;
  createdAt: Date | null;
  borrowCount?: number;
}

export type BorrowStatus = (typeof BORROW_STATUS_ENUM.enumValues)[number];

interface BorrowRequest {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: string;
  returnDate: string | null;
  status: BORROW_STATUS_ENUM;
  createdAt: Date | null;
  fullName: string;
  email: string;
  title: string;
  author: string;
  genre: string;
  coverColor: string;
  coverUrl: string;
}

// This new interface defines everything a dialog needs
export interface DialogConfig<T> {
  header: string;
  description: string;
  icon: string;
  buttonText: string;
  buttonBgColor: string;
  // The function to run when the user confirms the action
  onConfirm: (data: T) => Promise<void>;
  renderItem?: (item: T) => React.ReactNode;
}

// Update ActionConfig to include the optional dialog property
export interface ActionConfig<T> {
  buttonType: "text" | "icon";
  text?: string; // If type is text, this action is a normal button action. Renders the text of the button.
  icon?: string; // If type is icon, this action is an icon button action. Renders an image icon of size iconSize.
  iconSize?: number;
  tooltip?: string;
  onClick?: (data: T) => void;
  // If 'dialog' exists, this action opens a dialog.
  // Otherwise, 'onClick' runs directly.
  dialog?: DialogConfig<T>;
  link?: (data: T) => string; // If link exists, wrap the button with a Link component with href=link
}

// ColumnConfig and ColumnType remain the same
export type ColumnType =
  | "user"
  | "book"
  | "date"
  | "image"
  | "link"
  | "actions"
  | "text"
  | "component"
  | "dropdown";

// 1. Define base properties that ALL column types will share.
interface BaseColumnConfig<T> {
  header: string;
  width?: string;
}

// 2. Define a specific type for EACH value of `type`.
//    This is where the magic happens.
type RegularColumn<T> = BaseColumnConfig<T> & {
  type: "date" | "text"; // For simple text-based columns
  field: keyof T;
};

type UserColumn<T> = BaseColumnConfig<T> & {
  type: "user";
  field?: keyof T;
};

type BookColumn<T> = BaseColumnConfig<T> & {
  type: "book";
  field?: keyof T;
  linkField?: keyof T;
};

type ImageColumn<T> = BaseColumnConfig<T> & {
  type: "image";
  field: keyof T;
  linkPrefix: string;
  linkText: string;
  icon: string;
  iconSize?: number;
};

type ComponentColumn<T> = BaseColumnConfig<T> & {
  type: "component";
  field?: keyof T; // Make field optional as the component gets the whole row
  Component: React.ComponentType<{ data: T }>;
};

type DropdownColumn<T> = BaseColumnConfig<T> & {
  type: "dropdown";
  field: keyof T; // The field that holds the current value
  dropDownItems: DropDownItemModel<T>[];
  dropDownWidth?: string;
};

type ActionsColumn<T> = BaseColumnConfig<T> & {
  type: "actions";
  field?: string; // ✅ SOLVED: Field is now optional and can be any string
  actions: ActionConfig<T>[]; // You could define a stricter ActionConfig<T> type here too
};

// 3. Create the final ColumnConfig type as a union of all possible column types.
export type ColumnConfig<T> =
  | RegularColumn<T>
  | UserColumn<T>
  | BookColumn<T>
  | ImageColumn<T>
  | ComponentColumn<T>
  | DropdownColumn<T>
  | ActionsColumn<T>;

// export interface ColumnConfig<T> {
//   field: keyof T;
//   header: string;
//   type: ColumnType;
//   width?: string;
//   actions?: ActionConfig<T>[];
//   linkPrefix?: string; // Used for things like image endpoint
//   linkText?: string;
//   linkField?: keyof T; // Used for book ColumnType where its id comes from field "bookId" in BorrowRequestsClient
//   icon?: string;
//   iconSize?: number;
//   Component?: React.ComponentType<{ data: T }>;
//   dropDownItems?: DropDownItemModel<T>[];
//   dropDownWidth?: string;
// }

export type DropDownItemModel<T> = ItemModel & {
  bgColor: string;
  dotColor: string;
  textColor: string;
  width: string;
  value: string;
  onClick?: (data: T, item: DropDownItemModel<T>) => Promise<T>;
};
