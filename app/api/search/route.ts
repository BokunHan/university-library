import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { and, count, eq, ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const genre = searchParams.get("genre");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    if (!query) {
      return NextResponse.json({ data: [], totalPages: 0 });
    }

    const offset = (page - 1) * limit;

    // Create a reusable where condition
    const whereConditions = or(
      ilike(books.title, `%${query}%`),
      ilike(books.author, `%${query}%`),
    );

    // Add genre to the condition if it exists and is not 'All'
    const finalConditions =
      genre && genre !== "All"
        ? and(whereConditions, eq(books.genre, genre))
        : whereConditions;

    // Run the data query and the count query in parallel
    const resultsPromise = db
      .select()
      .from(books)
      .where(finalConditions)
      .limit(limit)
      .offset(offset);

    const countPromise = db
      .select({ value: count() })
      .from(books)
      .where(finalConditions);

    const [results, totalCount] = await Promise.all([
      resultsPromise,
      countPromise,
    ]);

    const totalPages = Math.ceil(totalCount[0].value / limit);

    // Return a structured object with data and totalPages
    return NextResponse.json({ data: results, totalPages });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Error searching the query" },
      { status: 500 },
    );
  }
}
