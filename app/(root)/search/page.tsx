"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BookCard from "@/components/BookCard";
import { Book } from "@/types";
import { useDebounce } from "@/lib/useDebounce";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Pagination = dynamic(() =>
  import("@/components/Pagination").then((mod) => mod.Pagination),
);

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<string[]>(["All"]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Hooks for managing URL state ---
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const activeFilter = searchParams.get("genre") || "All";
  const currentPage = Number(searchParams.get("page")) || 1;
  const debouncedQuery = useDebounce(query, 300);

  // --- Function to update URL state ---
  const setUrlState = useCallback(
    (name: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, String(value));
      // Reset page to 1 when query or filter changes
      if (name !== "page") {
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // --- The main data-fetching effect ---
  useEffect(() => {
    // AbortController to cancel stale requests
    const controller = new AbortController();

    const fetchBooks = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setTotalPages(0);
        return;
      }

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          genre: activeFilter,
          page: String(currentPage),
          limit: "12",
        });

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal, // Pass the signal to fetch
        });
        const data = await response.json();

        setResults(data.data);
        setTotalPages(data.totalPages);

        // This is just a placeholder, a real implementation would
        // fetch genres from a separate, cached endpoint.
        if (currentPage === 1 && activeFilter === "All") {
          const distinctGenres = [
            "All",
            ...new Set(data.data.map((book: Book) => book.genre)),
          ];
          setFilters(distinctGenres as string[]);
        }
      } catch (error) {
        // Ignore abort errors
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to fetch search results:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();

    // Cleanup function to abort the fetch on re-run
    return () => controller.abort();
  }, [debouncedQuery, currentPage, activeFilter]);

  const handleClear = () => {
    router.push(pathname);
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
              setUrlState("q", e.target.value);
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
              alt="loading"
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
                        onChange={(e) => setUrlState("genre", e.target.value)}
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
                        onPageChange={(page) => setUrlState("page", page)}
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
