"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit?: number;
  onPageChange: (newPage: number) => void;
  itemLabel?: string;
  className?: string;
}

export default function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  itemLabel = "items",
  className = "",
}: PaginationProps) {
  if (!total || totalPages <= 1) return null;

  const startRecord = Math.min((page - 1) * limit + 1, total);
  const endRecord = Math.min(page * limit, total);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 sm:px-4 mt-6 border-t border-gray-100 ${className}`}
    >
      <div className="text-sm text-gray-500 font-medium">
        Showing <span className="font-semibold text-gray-900">{startRecord}</span>–
        <span className="font-semibold text-gray-900">{endRecord}</span> of{" "}
        <span className="font-semibold text-gray-900">{total}</span> {itemLabel}
      </div>

      <div className="flex items-center gap-1.5">
        {/* PREV BUTTON */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${
            page <= 1
              ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
          }`}
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        {/* NUMBERS */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-gray-400 font-bold select-none text-sm"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === page;

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[34px] h-[34px] flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                isActive
                  ? "bg-[#4f7d16] text-white shadow-sm shadow-[#4f7d16]/20"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* NEXT BUTTON */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${
            page >= totalPages
              ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50"
              : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
          }`}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

