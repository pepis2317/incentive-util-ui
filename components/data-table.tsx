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
import { ArrowLeft, ArrowRight, GripVertical } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";


interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  rowCount?: number
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
        "absolute bg-background h-full inset-e-0 top-0 cursor-col-resize touch-none select-none opacity-70 hover:opacity-100 hover:bg-accent hover:shadow",
        header.column.getIsResizing() && "bg-border"
      )}
      onMouseDown={handler}
      onTouchStart={handler}
    >
      <div className="w-full h-full mr-1 flex items-center justify-center">
        <GripVertical size={16} />
      </div>
    </div>
  );
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  rowCount,
  enablePagination = true,
  getRowId
}: DataTableProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pagination = {
    pageIndex: Math.max(Number(searchParams.get("page") ?? 1) - 1, 0),
    pageSize: Number(searchParams.get("page_size") ?? 10)
  }

  const table = useTable({
    features,
    columnResizeMode: "onChange",
    manualPagination: true,
    data,
    columns,
    getRowId,
    rowCount,
    state: { pagination },
    onPaginationChange: (updater) => {
      const next = typeof updater == "function" ? updater(pagination) : updater
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(next.pageIndex + 1))
      params.set("page_size", String(next.pageSize))
      router.push(`${pathname}?${params.toString()}`)
    }
  })

  return (
    <div className="rounded-md border">
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
                    className="truncate align-top border-r"
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
