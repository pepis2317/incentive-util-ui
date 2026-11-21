"use client"

import { format } from "date-fns"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Button } from "../ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { Invoice } from "@/app/api/types"
import { DeleteInvoiceDialog } from "./delete-invoice-dialog"


const columnHelper = createColumnHelper<DataTableFeatures, Invoice>()

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0
})

const formatEpoch = (epoch: number) => new Date(epoch * 1000).toLocaleString()

export const invoiceColumns = columnHelper.columns([
  columnHelper.accessor("transaction_id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Id" />
    )
  }),
  columnHelper.accessor("customer_name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
    size: 250
  }),
  columnHelper.accessor("undiscounted_total", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Undiscounted Total" />
    ),
    cell: ({ getValue }) => currencyFormatter.format(getValue()),
    size: 250
  }),
  columnHelper.accessor("discounted_total", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discounted Total" />
    ),
    cell: ({ getValue }) => currencyFormatter.format(getValue()),
    size: 250
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: (info) => format(formatEpoch(info.getValue()), "LLL d, y, HH:mm")
  }),
  columnHelper.accessor("updated_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: (info) => {
      const value = info.getValue()
      return value == null ? "-" : format(formatEpoch(value), "LLL d, y, HH:mm")
    },
  }),
  columnHelper.display({
    header: "Action",
    cell: ({ row }) => (
      <div className="space-x-3">
        <Button size="icon-lg" className="min-w-12 h-12" type="submit" render={<Link href={`/${row.original.id}`} />} nativeButton={false}>
          <Pencil />
        </Button>
        <DeleteInvoiceDialog id={row.original.id} />
      </div>
    )
  }),
])

