"use client"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { DiscountRecordsCell } from "./discount-records-cell"
import { DiscountRecord, TransactionRecord } from "@/app/api/types"
import { EditTransactionDialog } from "./edit-transaction-dialog"
import { format } from "date-fns"
import { DeleteIcon } from "lucide-react"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"

const columnHelper = createColumnHelper<DataTableFeatures, TransactionRecord>()

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0
})

const applyDiscount = (price: number, discounts: DiscountRecord[]) => {
  let total = price
  discounts.forEach(discount => {
    if (discount.type == "flat") total -= discount.value
    else if (discount.type == "percentage") total -= total * (discount.value / 100)
  })
  return total
}

const formatEpoch = (epoch: number) => new Date(epoch * 1000).toLocaleString()

export const RecordColumns = columnHelper.columns([
  columnHelper.accessor("item.name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item Name" />
    )
  }),
  columnHelper.accessor("price_snapshot", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Snapshot" />
    ),
    cell: ({ getValue }) => currencyFormatter.format(getValue()),
  }),
  columnHelper.accessor("quantity", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    )
  }),
  columnHelper.display({
    id: "discount_records",
    header: "Discounts",
    cell: ({ row }) => (
      <DiscountRecordsCell discountRecords={row.original.discount_records} />
    ),
    size: 200

  }),
  columnHelper.accessor(
    (row) => row.quantity * row.price_snapshot,
    {
      id: "undiscounted_total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Undiscounted Total" />
      ),
      cell: ({ getValue }) => currencyFormatter.format(getValue()),
      size: 200
    }
  ),
  columnHelper.accessor(
    (row) => row.quantity * applyDiscount(row.price_snapshot, row.discount_records),
    {
      id: "discounted_total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Discounted Total" />
      ),
      cell: ({ getValue }) => currencyFormatter.format(getValue()),
      size: 200
    }
  ),
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
    cell: ({ row }) =>
      <div className="space-x-2">
        <EditTransactionDialog transaction={row.original} />
        <DeleteTransactionDialog id={row.original.id} />
      </div>
  })
])
