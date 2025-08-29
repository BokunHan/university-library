"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import BookCard from "@/components/BookCard";
import { Book } from "@/types";
import { useDebounce } from "@/lib/useDebounce";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";

const Page = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<string[]>(["All"]);

  const [results, setResults] = useState<Book[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 12;

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedQuery) {
        setIsLoading(true);
        const response = await fetch(`/api/search?q=${debouncedQuery}`);
        const data = await response.json();

        setAllBooks(data);
        setCurrentPage(1);
        setActiveFilter("All");

        setIsLoading(false);
      } else {
        setAllBooks([]);
      }
    };

    fetchBooks();
  }, [debouncedQuery]);

  useEffect(() => {
    if (allBooks.length > 0) {
      // 1. Extract distinct genres for the filter dropdown
      const distinctGenres = [
        "All",
        ...new Set(allBooks.map((book) => book.genre)),
      ];
      setFilters(distinctGenres);

      // 2. Apply the active filter
      const filteredBooks =
        activeFilter === "All"
          ? allBooks
          : allBooks.filter((book) => book.genre === activeFilter);

      // 3. Calculate total pages based on the filtered list
      setTotalPages(Math.ceil(filteredBooks.length / limit));

      // 4. Apply pagination to get the books for the current page
      const offset = (currentPage - 1) * limit;
      const paginatedBooks = filteredBooks.slice(offset, offset + limit);
      setResults(paginatedBooks);
    } else {
      // Clear everything if there are no books
      setResults([]);
      setTotalPages(0);
      setFilters(["All"]);
    }
  }, [allBooks, currentPage, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setActiveFilter("All");
    setCurrentPage(1);
    setTotalPages(0);
    searchInputRef.current?.focus();
  };

  return (
    <main className="flex flex-col items-center gap-6 w-full">
      <section className="flex flex-col items-center max-w-[630px] mb-14">
        <p className="text-lg text-light-100 font-semibold">
          DISCOVER YOUR NEXT GREAT READ
        </p>
        <p className="text-[56px] text-white font-semibold leading-tight">
          Explore and Search for <span className="text-primary">Any Book</span>{" "}
          In Our Library
        </p>
        <div className="search gap-2">
          <Image
            src="/icons/search-fill.svg"
            alt="Search"
            width={28}
            height={28}
          />
          <input
            className="search-input"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setIsLoading(true);
              setQuery(e.target.value);
            }}
            ref={searchInputRef}
            autoFocus={true}
          />
        </div>
      </section>

      {query && (
        <>
          {isLoading ? (
            <img
              src="/icons/admin/loader.svg"
              className="size-10 animate-spin"
            />
          ) : (
            <>
              <section className="flex flex-col w-full my-3">
                <div
                  className={cn(
                    "flex",
                    results.length > 0 ? "justify-between" : "justify-start",
                  )}
                >
                  <p className="text-3xl font-semibold text-light-100">
                    {results.length > 0 ? (
                      "Search Results"
                    ) : (
                      <>
                        Search Result for{" "}
                        <span className="text-primary">{query}</span>
                      </>
                    )}
                  </p>
                  {results.length > 0 && (
                    <div className="flex h-10 items-center bg-dark-300 p-3 rounded-md">
                      <p className="text-base text-light-100">Filter by:</p>
                      <select
                        value={activeFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="select-trigger"
                      >
                        {filters.map((filter) => (
                          <option
                            key={filter}
                            value={filter}
                            className="select-item"
                          >
                            {filter}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </section>

              <section className="flex flex-col items-center gap-12 w-full mb-10">
                {results.length > 0 ? (
                  <>
                    <ul className="book-list">
                      {results.map((book, i) => (
                        <BookCard key={i} {...book} />
                      ))}
                    </ul>

                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-5 my-20 max-w-[360px]">
                    <Image
                      src="/images/no-books.png"
                      alt="no-books"
                      width={200}
                      height={200}
                    />
                    <p className="text-2xl text-white font-semibold">
                      No Results Found
                    </p>
                    <p className="text-base text-light-100">
                      We couldn’t find any books matching your search. Try using
                      different keywords or check for typos.
                    </p>
                    <Button
                      className="font-bebas-neue text-xl text-dark-100 w-full min-h-12"
                      onClick={handleClear}
                      variant="default"
                    >
                      CLEAR SEARCH
                    </Button>
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
};
export default Page;
