"use client"
import { cn } from "@/lib/utils";
import { type Header, useTable, type ColumnDef, type RowData } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { type DataTableFeatures, features } from "./data-table-features"
import { ArrowLeft, ArrowRight } from "lucide-react"


interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  enablePagination?: boolean,
  getRowId?: (row: TData, index: number) => string
}

function ResizeHandle<TData extends RowData>(props: { header: Header<typeof features, TData, unknown> }) {
  const { header } = props;
  const handler = header.getResizeHandler();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-y-0 end-0 w-1 cursor-col-resize touch-none select-none bg-border opacity-0 hover:opacity-100",
        header.column.getIsResizing() && "bg-primary opacity-100"
      )}
      onMouseDown={handler}
      onTouchStart={handler}
    />
  );
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  enablePagination = true,
  getRowId
}: DataTableProps<TData>) {
  const table = useTable({
    features,
    columnResizeMode: "onChange",
    manualPagination: !enablePagination,
    data,
    columns,
    getRowId
  })

  return (
    <div className="rounded-md border mt-5">
      <Table className="table-fixed" style={{ width: table.getTotalSize() }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative bg-background pl-3"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                    <ResizeHandle header={header} />
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell
                    className="truncate align-top"
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {enablePagination && (
        <div className="flex items-center justify-center space-x-2 py-4 mx-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.state.pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  )
}
