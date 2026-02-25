import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5; // Adjust this to show more/less numbers

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic for ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };


  return (
    <div className="flex items-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="w-10 h-10 flex items-center justify-center text-[#64748B] font-medium">
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(page)}

                className={`w-10 h-10 flex items-center justify-center rounded-xl text-[14px] font-semibold transition-all ${currentPage === page
                  ? "bg-[#0F172A] text-white shadow-sm"
                  : "border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
