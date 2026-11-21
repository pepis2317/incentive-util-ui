"use client"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { DataTableColumnHeader } from "../data-table-column-header"
import { TransactionRecord } from "@/app/api/types"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { EditTransactionWrapper } from "./edit-transaction-wrapper"

const columnHelper = createColumnHelper<DataTableFeatures, TransactionRecord>()

export const RecordColumns = columnHelper.columns([
  columnHelper.accessor("item.name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item Name" />
    ),
    size: 180
  }),
  columnHelper.display({
    header: "Action",
    cell: ({ row }) => {
      const item = {
        item_name: row.original.item.name,
        item_id: row.original.item_id,
        quantity: row.original.quantity,
        price_snapshot: row.original.price_snapshot,
        discounts: row.original.discount_records.map((discount) => ({
          id: discount.id,
          type: discount.type,
          value: discount.value,
          step: discount.step,
        })),
        discount_ids_to_delete: [],
        discounts_to_add: []
      }
      return (
        <div className="space-x-3">
          <EditTransactionWrapper item={item} transaction={row.original} />
          <DeleteTransactionDialog id={row.original.id} />
        </div>
      )
    }
  })
])
