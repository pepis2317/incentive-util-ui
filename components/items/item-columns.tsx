"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { EditItemDialog } from "./edit-item-dialog"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Item } from "@/app/api/types"
import { format } from "date-fns"

const columnHelper = createColumnHelper<DataTableFeatures, Item>()

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0
})

const formatEpoch = (epoch: number) => new Date(epoch * 1000).toLocaleString()

export const itemColumns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    )
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    )
  }),
  columnHelper.accessor("type", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    )
  }),
  columnHelper.accessor("brand", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    )
  }),
  columnHelper.accessor("unit", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit" />
    )
  }),
  columnHelper.accessor("sell_price", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sell Price" />
    ),
    cell: ({ getValue }) => currencyFormatter.format(getValue())
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
    cell: ({ row }) => <EditItemDialog item={row.original} />,
  }),
])

