"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Button } from "../ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"
import { Invoice } from "@/app/api/types"


const columnHelper = createColumnHelper<DataTableFeatures, Invoice>()

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
    )
  }),
  columnHelper.accessor("undiscounted_total", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Undiscounted Total" />
    )
  }),
  columnHelper.accessor("discounted_total", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discounted Total" />
    )
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: (info) => formatEpoch(info.getValue())
  }),
  columnHelper.accessor("updated_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: (info) => {
      const value = info.getValue()
      return value == null ? "-" : formatEpoch(value)
    },
  }),
  columnHelper.display({
    header: "Action",
    cell: ({ row }) => (
      <Button size="icon-sm" type="submit" render={<Link href={`/invoices/${row.original.id}`} />} nativeButton={false}>
        <Pencil />
      </Button>
    )
  }),
])

