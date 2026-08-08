import React from "react";

import { cn } from "@/components/cn";

export interface SpecColumn<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface SpecTableProps<T> {
  columns: SpecColumn<T>[];
  rows: T[];
  /** Min width keeps the table scrollable on mobile (PRD §5). */
  minWidth?: string;
  className?: string;
}

export function SpecTable<T>({ columns, rows, minWidth = "700px", className }: SpecTableProps<T>) {
  return (
    <div
      className={cn("overflow-x-auto border border-slate-deep bg-surface-lowest", className)}
      data-lenis-prevent
    >
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="bg-slate-deep text-white">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="border-r border-slate/60 p-sm text-label-md font-semibold uppercase tracking-wider last:border-r-0"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-body-lg text-slate-deep">
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-t border-outline-variant transition-colors duration-150 hover:bg-surface-mid",
                i % 2 === 0 ? "bg-surface-lowest" : "bg-surface-low",
              )}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn("border-r border-outline-variant p-sm last:border-r-0", col.className)}
                >
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
