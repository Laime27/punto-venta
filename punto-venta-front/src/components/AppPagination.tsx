import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AppPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function AppPagination({ page, totalPages, onPageChange, disabled }: AppPaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const handleClick = (target: number) => {
    if (target === page || disabled) return;
    onPageChange(target);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handleClick(page - 1)}
            aria-disabled={page <= 1 || disabled}
            className={
              page <= 1 || disabled
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getPages().map((p, i) =>
          p === "..." ? (
            <PaginationItem key={`ellipsis-${i}`} className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p} className="hidden sm:block">
              <PaginationLink
                isActive={p === page}
                onClick={() => handleClick(p)}
                className={disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => handleClick(page + 1)}
            aria-disabled={page >= totalPages || disabled}
            className={
              page >= totalPages || disabled
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
