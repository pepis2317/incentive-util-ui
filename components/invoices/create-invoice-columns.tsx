"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { ItemComboBoxCell, FormInputCell } from "./form-input-cell"
import { Button } from "../ui/button"
import { DiscountInputCell } from "./form-discounts-cell"
import { Trash, X } from "lucide-react"
import { FieldArrayWithId } from "react-hook-form"
import { RecordAddItem } from "@/app/api/types"

type InvoiceFormValues = { items: RecordAddItem[] }
export type InvoiceRow = FieldArrayWithId<InvoiceFormValues, "items", "id">

const columnHelper = createColumnHelper<DataTableFeatures, InvoiceRow>()

export function createInvoiceColumns({
  onRemove,
}: {
  onRemove: (index: number) => void
}) {
  return columnHelper.columns([
    columnHelper.accessor("item_id", {
      header: "Item Id",
      cell: ({ row }) => <ItemComboBoxCell index={row.index} />,
      enableSorting: false,
    }),
    columnHelper.accessor("item_quantity", {
      header: "Qty",
      cell: ({ row }) => (
        <FormInputCell index={row.index} field="item_quantity" type="number" />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("price_snapshot", {
      header: "Price",
      cell: ({ row }) => (
        <FormInputCell index={row.index} field="price_snapshot" type="number" />
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      id: "discounts",
      header: "Discounts",
      size: 300,
      cell: ({ row }) => <DiscountInputCell index={row.index} />,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 100,
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
