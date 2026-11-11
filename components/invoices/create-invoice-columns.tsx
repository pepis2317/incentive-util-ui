"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { ItemInputCell } from "./form-input-cell"
import { Button } from "../ui/button"
import { DiscountInputCell } from "./form-discounts-cell"
import { Trash, X } from "lucide-react"

export type ItemDiscount = {
  discount_type: string
  discount_value: number
}
export type RecordAddItem = {
  item_id: string
  item_quantity: number
  price_snapshot: number
  discounts: ItemDiscount[]
}
export type RecordAddForm = {
  customer_id: string
  transaction_id: string
  items: RecordAddItem[]
}

const columnHelper = createColumnHelper<DataTableFeatures, RecordAddItem>()

export function createInvoiceColumns({
  onRemove,
}: {
  onRemove: (index: number) => void
}) {
  return columnHelper.columns([
    columnHelper.accessor("item_id", {
      header: "Item Id",
      cell: ({ row }) => <ItemInputCell index={row.index} field="item_id" />,
      enableSorting: false,
    }),
    columnHelper.accessor("item_quantity", {
      header: "Qty",
      cell: ({ row }) => (
        <ItemInputCell index={row.index} field="item_quantity" type="number" />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("price_snapshot", {
      header: "Price",
      cell: ({ row }) => (
        <ItemInputCell index={row.index} field="price_snapshot" type="number" />
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      id: "discounts",
      header: "Discounts",
      cell: ({ row }) => <DiscountInputCell index={row.index} />,
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onRemove(row.index)}
        >
          <Trash />
        </Button>
      ),
    }),
  ])
}
