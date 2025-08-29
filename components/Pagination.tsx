import { useMemo } from "react";

export const DOTS = "...";

export const usePagination = ({
  totalPages,
  siblingCount = 1,
  currentPage,
}: {
  totalPages: number;
  siblingCount?: number;
  currentPage: number;
}) => {
  const paginationRange = useMemo(() => {
    // Number of items to show: 1st page + last page + current page + siblings + 2 * DOTS
    const totalPageNumbers = siblingCount + 5;

    // Case 1: If total pages is less than the numbers we want to show, return the full range
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots, but right dots needed
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: No right dots, but left dots needed
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots needed
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return []; // Fallback for any other case
  }, [totalPages, siblingCount, currentPage]);

  return paginationRange;
};

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount,
}: Props) => {
  const paginationRange = usePagination({
    totalPages,
    currentPage,
    siblingCount,
  });

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-3 w-full pt-8 border-t border-dark-300/50">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="pagination-btn_dark"
      >
        <p className="pagination-p_dark">&lt;</p>
      </button>
      {paginationRange?.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <button key={index} disabled={true} className="pagination-btn_dark">
              <p className="pagination-p_dark">&#8230;</p>
            </button>
          );
        }

        return (
          <button
            key={index}
            onClick={() => onPageChange(pageNumber as number)}
            className={
              currentPage === pageNumber
                ? "pagination-btn_light"
                : "pagination-btn_dark"
            }
          >
            <p
              className={
                currentPage === pageNumber
                  ? "pagination-p_light"
                  : "pagination-p_dark"
              }
            >
              {pageNumber}
            </p>
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="pagination-btn_dark"
      >
        <p className="pagination-p_dark">&gt;</p>
      </button>
    </div>
  );
};
