import React, { useState, useMemo, useEffect } from "react";
import styles from "./table.module.css";
import { useQuery } from "../../hooks/useQuery";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchTerm?: string;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  enableSelection?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  emptyMessage?: string;
  rowKey: keyof T & string;
  onPageSizeChange?: (pageSize: number) => void;
}

function Table<T>({
  data,
  columns,
  searchTerm = "",
  searchKeys = [],
  pageSize = 10,
  loading = false,
  onRowClick,
  enableSelection = false,
  onSelectionChange,
  emptyMessage = "No data available",
  rowKey,
  onPageSizeChange,
}: TableProps<T>) {
  const { queryParams, updateQueries } = useQuery();
  const [selectedRows, setSelectedRows] = useState<
    Set<string | number | symbol>
  >(new Set());

  // Get current page and sort from URL or defaults
  const currentPage = parseInt(queryParams.page || "1", 10);
  const sortKey = queryParams.sortBy || "";
  const sortOrder = (queryParams.sortOrder as "asc" | "desc") || "asc";

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || searchKeys.length === 0) return data;

    return data.filter((row) => {
      return searchKeys.some((key) => {
        const value = row[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (key: string) => {
    const newSortOrder =
      sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    updateQueries({ sortBy: key, sortOrder: newSortOrder, page: "1" }, true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateQueries({ page: String(page) }, true);
    }
  };

  // Handle row selection
  const handleRowSelect = (rowId: string | number | symbol) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);

    if (onSelectionChange) {
      const selectedData = data.filter((row) => {
        const id = row[rowKey] as string | number | symbol;
        return newSelected.has(id);
      });
      onSelectionChange(selectedData);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const allIds = new Set<string | number | symbol>();
      paginatedData.forEach((row) => {
        allIds.add(row[rowKey] as string | number | symbol);
      });
      setSelectedRows(allIds);
      onSelectionChange?.(paginatedData);
    }
  };

  const isAllSelected =
    paginatedData.length > 0 && selectedRows.size === paginatedData.length;

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm && currentPage > 1) {
      updateQueries({ page: "1" }, true);
    }
  }, [searchTerm, currentPage, updateQueries]);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {enableSelection && (
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={column.sortable ? styles.sortableHeader : ""}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={styles.headerContent}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className={styles.sortIcon}>
                        {sortKey === column.key ? (
                          sortOrder === "asc" ? (
                            <span>↑</span>
                          ) : (
                            <span>↓</span>
                          )
                        ) : (
                          <span className={styles.sortIconInactive}>⇅</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className={styles.loading}
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className={styles.empty}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const rowId = row[rowKey];
                const rowIdValue = rowId as string | number | symbol;
                const isSelected = selectedRows.has(rowIdValue);

                return (
                  <tr
                    key={String(rowId)}
                    onClick={() => onRowClick?.(row)}
                    className={`${onRowClick ? styles.clickableRow : ""} ${
                      isSelected ? styles.selectedRow : ""
                    }`}
                  >
                    {enableSelection && (
                      <td className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(rowIdValue);
                          }}
                          className={styles.checkbox}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.render
                          ? column.render(row)
                          : String(
                              (row as Record<string, unknown>)[column.key] ?? ""
                            )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && paginatedData.length > 0 && (
        <div className={styles.pagination}>
          {/* Page Size Selector */}
          {onPageSizeChange && (
            <div className={styles.pageSizeSelector}>
              <select
                className={styles.pageSizeSelect}
                value={pageSize.toString()}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  onPageSizeChange(newSize);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          )}

          <div className={styles.paginationInfo}>
            {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length}
          </div>

          <div className={styles.paginationControls}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              «
            </button>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              ‹
            </button>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              ›
            </button>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
