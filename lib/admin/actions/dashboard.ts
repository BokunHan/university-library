import { DashboardStats } from "@/types";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { sql, gte, lte, and } from "drizzle-orm";
import dayjs from "dayjs";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // 1. Define the date ranges as full Date objects, not strings.
    // Drizzle ORM works best with native Date objects for timestamp fields.
    const startOfCurrentMonth = dayjs().startOf("month").toDate();
    const startOfLastMonth = dayjs()
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfLastMonth = dayjs().subtract(1, "month").endOf("month").toDate();

    // 2. Define all the database count queries.
    // Each query now filters and counts inside the database.
    const queries = [
      // Total counts
      db.select({ count: sql<number>`count(*)` }).from(borrowRecords),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(books),
      // Borrows counts
      db
        .select({ count: sql<number>`count(*)` })
        .from(borrowRecords)
        .where(gte(borrowRecords.createdAt, startOfCurrentMonth)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(borrowRecords)
        .where(
          and(
            gte(borrowRecords.createdAt, startOfLastMonth),
            lte(borrowRecords.createdAt, endOfLastMonth),
          ),
        ),
      // Users counts
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(gte(users.createdAt, startOfCurrentMonth)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(
          and(
            gte(users.createdAt, startOfLastMonth),
            lte(users.createdAt, endOfLastMonth),
          ),
        ),
      // Books counts
      db
        .select({ count: sql<number>`count(*)` })
        .from(books)
        .where(gte(books.createdAt, startOfCurrentMonth)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(books)
        .where(
          and(
            gte(books.createdAt, startOfLastMonth),
            lte(books.createdAt, endOfLastMonth),
          ),
        ),
    ];

    // 3. Execute all queries in parallel.
    const results = await Promise.all(queries);

    // Helper to safely parse the count which comes back as a string
    const getCount = (result: { count: string | number }[]): number =>
      Number(result[0]?.count ?? 0);

    // 4. Structure the response from the query results.
    return {
      totalBorrows: getCount(results[0]),
      totalUsers: getCount(results[1]),
      totalBooks: getCount(results[2]),
      booksBorrowed: {
        currentMonth: getCount(results[3]),
        lastMonth: getCount(results[4]),
      },
      usersJoined: {
        currentMonth: getCount(results[5]),
        lastMonth: getCount(results[6]),
      },
      booksCreated: {
        currentMonth: getCount(results[7]),
        lastMonth: getCount(results[8]),
      },
    } as DashboardStats;
  } catch (error) {
    console.error("Error getting dashboard stats", error);
    // Return a default empty state on error
    return {
      totalBorrows: 0,
      totalUsers: 0,
      totalBooks: 0,
      booksBorrowed: { currentMonth: 0, lastMonth: 0 },
      usersJoined: { currentMonth: 0, lastMonth: 0 },
      booksCreated: { currentMonth: 0, lastMonth: 0 },
    } as DashboardStats;
  }
};
