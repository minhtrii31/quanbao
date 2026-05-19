"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Trash2, ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog, EmptyState, PageError } from "@/components/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filterOptions?: { label: string; value: string }[];
  itemsPerPage?: number;
  actionLink?: (item: T) => string;
  actionLabel?: string;
  getRowId?: (item: T) => string;
  onDelete?: (item: T) => void | Promise<void>;
  deleteLabel?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (key: string, order: "asc" | "desc") => void;
}

export function DataTable<T extends object>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Tìm kiếm...",
  filterable = false,
  filterOptions = [],
  itemsPerPage = 10,
  actionLink,
  actionLabel = "Sửa",
  getRowId,
  onDelete,
  deleteLabel = "Xóa",
  emptyMessage = "Không có dữ liệu",
  loading = false,
  error = null,
  onRetry,
  totalItems,
  totalPages: controlledTotalPages,
  currentPage: controlledCurrentPage,
  onPageChange,
  searchQuery: controlledSearchQuery,
  onSearchChange,
  activeFilter: controlledActiveFilter,
  onFilterChange,
  sortBy: controlledSortBy,
  sortOrder: controlledSortOrder,
  onSortChange,
}: DataTableProps<T>) {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localActiveFilter, setLocalActiveFilter] = useState<string>("");
  const [localSortBy, setLocalSortBy] = useState<string | null>(null);
  const [localSortOrder, setLocalSortOrder] = useState<"asc" | "desc">("asc");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ item: T; index: number } | null>(null);
  const [searchInput, setSearchInput] = useState(controlledSearchQuery ?? "");

  const isServerDriven = Boolean(onPageChange || onSearchChange || onFilterChange || onSortChange);
  const searchQuery = controlledSearchQuery ?? localSearchQuery;
  const activeFilter = controlledActiveFilter ?? localActiveFilter;
  const sortBy = controlledSortBy ?? localSortBy;
  const sortOrder = controlledSortOrder ?? localSortOrder;
  const currentPage = controlledCurrentPage ?? localCurrentPage;

  const getItemId = (item: T, fallback: number) =>
    getRowId?.(item) ?? String((item as { _id?: string; id?: string })._id ?? (item as { id?: string }).id ?? fallback);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (!isServerDriven && searchQuery) {
      result = result.filter((item) =>
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (!isServerDriven && activeFilter && filterable) {
      result = result.filter((item) =>
        Object.values(item).some(
          (val) =>
            typeof val === "string" &&
            val.toLowerCase().includes(activeFilter.toLowerCase())
        )
      );
    }

    if (!isServerDriven && sortBy) {
      result.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortBy];
        const bVal = (b as Record<string, unknown>)[sortBy];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, activeFilter, sortBy, sortOrder, filterable, isServerDriven]);

  const visibleTotal = totalItems ?? filteredData.length;
  const totalPages = controlledTotalPages ?? Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = isServerDriven ? filteredData : filteredData.slice(startIndex, startIndex + itemsPerPage);

  const setPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
    if (onPageChange) onPageChange(nextPage);
    else setLocalCurrentPage(nextPage);
  };

  const setSearch = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    else setLocalSearchQuery(value);
    setPage(1);
  };

  useEffect(() => {
    setSearchInput(controlledSearchQuery ?? localSearchQuery);
  }, [controlledSearchQuery, localSearchQuery]);

  useEffect(() => {
    if (searchInput === searchQuery) return;
    const timeout = window.setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => window.clearTimeout(timeout);
    // setSearch intentionally stays outside deps to avoid resetting the timer on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, searchQuery]);

  const setFilter = (value: string) => {
    if (onFilterChange) onFilterChange(value);
    else setLocalActiveFilter(value);
    setPage(1);
  };

  const handleSort = (key: string) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    const nextOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    if (onSortChange) {
      onSortChange(key, nextOrder);
      setPage(1);
      return;
    }

    if (sortBy === key) {
      setLocalSortOrder(nextOrder);
    } else {
      setLocalSortBy(key);
      setLocalSortOrder("asc");
    }
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    if (!pendingDelete) return;
    const rowId = getItemId(pendingDelete.item, pendingDelete.index);

    try {
      setDeletingId(rowId);
      await onDelete(pendingDelete.item);
      setPendingDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9 rounded-none w-full sm:w-64"
                value={searchInput}
                aria-label={searchPlaceholder}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
            </div>
          )}
          {filterable && filterOptions.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant={!activeFilter ? "outline" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setFilter("")}
              >
                Tất cả
              </Button>
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilter === option.value ? "outline" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Hiển thị{" "}
          {filteredData.length > 0
            ? `${startIndex + 1}-${Math.min(
                startIndex + itemsPerPage,
                visibleTotal
              )}`
            : "0-0"}{" "}
          của {visibleTotal}
        </div>
      </div>

      {error && (
        <PageError message={error} onRetry={onRetry} />
      )}

      <div className="border border-border rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-12">#</TableHead>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`${
                      col.sortable ? "cursor-pointer hover:bg-muted/50" : ""
                    } ${col.width || ""}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                    aria-sort={
                      col.sortable && sortBy === col.key
                        ? sortOrder === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        sortBy === col.key ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/70" aria-hidden="true" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
                {(actionLink || onDelete) && (
                  <TableHead className="w-28 text-right">Thao tác</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actionLink || onDelete ? 2 : 1)}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const rowId = getItemId(item, startIndex + index);
                  return (
                  <TableRow
                    key={rowId}
                    className="border-b last:border-0 hover:bg-muted/20"
                  >
                    <TableCell className="text-muted-foreground">
                      {startIndex + index + 1}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.align === "right" ? "text-right" : ""}>
                        {col.render
                          ? col.render(item, startIndex + index + 1)
                          : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                      </TableCell>
                    ))}
                    {(actionLink || onDelete) && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {actionLink && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-7 px-2.5 text-xs rounded-none"
                            >
                              <Link href={actionLink(item)} aria-label={`${actionLabel} mục ${startIndex + index + 1}`}>
                                {actionLabel}
                              </Link>
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2.5 text-xs rounded-none text-destructive hover:text-destructive"
                              onClick={() => setPendingDelete({ item, index: startIndex + index })}
                              disabled={deletingId === rowId}
                              title={deleteLabel}
                              aria-label={`${deleteLabel} mục ${startIndex + index + 1}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actionLink || onDelete ? 2 : 1)}
                    className="py-6"
                  >
                    <EmptyState title={emptyMessage} className="border-0 bg-transparent p-4" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none h-8 w-8 p-0"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
            )
            .map((page, idx, arr) => (
              <div key={page} className="flex items-center">
                {idx > 0 && arr[idx - 1] !== page - 1 && (
                  <span className="text-muted-foreground px-1">...</span>
                )}
                <Button
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none h-8 w-8 p-0"
                  onClick={() => setPage(page)}
                  aria-label={`Trang ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </Button>
              </div>
            ))}
          <Button
            variant="outline"
            size="sm"
            className="rounded-none h-8 w-8 p-0"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa mục này? Thao tác này không thể hoàn tác."
        confirmLabel={deleteLabel}
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      />
    </div>
  );
}
