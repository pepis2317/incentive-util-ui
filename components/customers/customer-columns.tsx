"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { EditCustomerDialog } from "./edit-customer-dialog"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Customer } from "@/app/api/types"

const columnHelper = createColumnHelper<DataTableFeatures, Customer>()

const formatEpoch = (epoch: number) => new Date(epoch * 1000).toLocaleString()

export const customerColumns = columnHelper.columns([
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
    cell: ({ row }) => <EditCustomerDialog customer={row.original} />,
  }),
])
