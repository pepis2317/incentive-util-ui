"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { TransactionRecordSnapshot } from "@/app/api/types"
import { DiscountRecordsCell } from "./discount-records-cell"

const columnHelper = createColumnHelper<DataTableFeatures, TransactionRecordSnapshot>()


export const invoiceChangesColumns = columnHelper.columns([
  columnHelper.accessor("item.name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item" />
    )
  }),
  columnHelper.accessor("price_snapshot", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Snapshot" />
    )
  }),
  columnHelper.accessor("quantity", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    )
  }),
  columnHelper.accessor("discount_record_snapshots", {
    id: "discount_record_snapshots",
    header: "Discounts",
    cell: ({ row }) => {
      const mapped = row.original.discount_record_snapshots.map((snapshot) => ({
        id: snapshot.id,
        transaction_record_id: -1,
        type: snapshot.type,
        step: snapshot.step,
        value: snapshot.value,
        created_at: snapshot.created_at,
        updated_at: null
      }))
      return (
        <DiscountRecordsCell discountRecords={mapped} />
      )
    },
  }),
])

