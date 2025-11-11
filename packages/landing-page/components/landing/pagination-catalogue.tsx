"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@landing/components/ui/pagination";

interface PaginationCatalogueProps {
  currentPage: number;
  totalPages: number;
  generateHref: (page: number) => string;
}

export function PaginationCatalogue({
  currentPage,
  totalPages,
  generateHref,
}: PaginationCatalogueProps) {
  const maxPageNumbersToShow = 5;
  const pages = [];

  let start = Math.max(currentPage - Math.floor(maxPageNumbersToShow / 2), 1);
  const end = Math.min(start + maxPageNumbersToShow - 1, totalPages);

  if (end - start < maxPageNumbersToShow - 1) {
    start = Math.max(end - maxPageNumbersToShow + 1, 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={generateHref(Math.max(currentPage - 1, 1))}
          />
        </PaginationItem>

        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={generateHref(1)}>1</PaginationLink>
            </PaginationItem>
            {start > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={generateHref(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={generateHref(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href={generateHref(Math.min(currentPage + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
