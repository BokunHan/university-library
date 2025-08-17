"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, ROLE_ENUM, users } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { User } from "@/types";

type UserRole = (typeof ROLE_ENUM.enumValues)[number];

export const getAllUsers = async () => {
  const allUsers = (await db.select().from(users).limit(10)) as User[];
  return allUsers;
};

export const getBorrowCounts = async () => {
  const borrowCounts = await db
    .select({
      userId: borrowRecords.userId,
      count: sql`count(${borrowRecords.id})`.mapWith(Number),
    })
    .from(borrowRecords)
    .groupBy(borrowRecords.userId);
  // Returns an array like: [{ userId: 'abc', count: 5 }, ...]
  return borrowCounts;
};

export const changeUserRole = async (id: string, role: string) => {
  const updatedUser = await db
    .update(users)
    .set({ role: role as UserRole })
    .where(eq(users.id, id))
    .returning();

  if (updatedUser.length === 0) throw new Error("Failed to update user role");

  return updatedUser[0];
};

export const deleteUser = async (id: string) => {
  const deleteUser = await db.delete(users).where(eq(users.id, id));

  if (!deleteUser) throw new Error("Failed to delete user");
};

export const getAccountRequests = async (limit: number, offset: number) => {
  const pendingUsers = (await db
    .select()
    .from(users)
    .where(eq(users.status, "PENDING"))
    .limit(limit)
    .offset(offset)) as User[];

  return pendingUsers;
};

export const approveAccountRequest = async (id: string) => {
  const approvedUser = await db
    .update(users)
    .set({ status: "APPROVED" })
    .where(eq(users.id, id));

  if (!approvedUser) throw new Error("Failed to approve user");
};

export const rejectAccountRequest = async (id: string) => {
  const approvedUser = await db
    .update(users)
    .set({ status: "REJECTED" })
    .where(eq(users.id, id));

  if (!approvedUser) throw new Error("Failed to reject user");
};
