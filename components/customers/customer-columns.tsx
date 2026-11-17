"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { EditCustomerDialog } from "./edit-customer-dialog"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Customer } from "@/app/api/types"
import { format } from "date-fns"

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
    cell: ({ row }) => <EditCustomerDialog customer={row.original} />,
  }),
])
