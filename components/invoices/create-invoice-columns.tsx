"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "../data-table-features"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"
import { FieldArrayWithId } from "react-hook-form"
import { EditAddItemModel, InvoiceAddItem } from "@/app/api/types"
import { DataTableColumnHeader } from "../data-table-column-header"
import { EditAddItemDialog } from "./edit-add-item-dialog"

type InvoiceFormValues = { items: InvoiceAddItem[] }
export type InvoiceRow = FieldArrayWithId<InvoiceFormValues, "items", "id">

const columnHelper = createColumnHelper<DataTableFeatures, InvoiceRow>()

export function createInvoiceColumns({ onRemove, onEdit }: { onRemove: (index: number) => void, onEdit: (index: number, item: InvoiceAddItem) => void }) {
  return columnHelper.columns([
    columnHelper.accessor("item_name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Item Name" />
      ),
      enableSorting: false,
      size: 180
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      size: 200,
      cell: ({ row }) => {
        const mapped = {
          item_name: row.original.item_name,
          item_id: row.original.item_id,
          quantity: row.original.item_quantity,
          price_snapshot: row.original.price_snapshot,
          discounts: [],
          discount_ids_to_delete: [],
          discounts_to_add: row.original.discounts.map((discount) => ({
            id: -1,
            type: discount.discount_type,
            value: discount.discount_value,
            step: discount.discount_step
          })),
        }
        const handleOnEdit = async (index: number, item: EditAddItemModel) => {
          onEdit(index, {
            item_name: item.item_name,
            item_id: item.item_id,
            item_quantity: item.quantity,
            price_snapshot: item.price_snapshot,
            discounts: item.discounts_to_add.map((discount) => ({
              discount_type: discount.type,
              discount_step: discount.step,
              discount_value: discount.value
            }))
          })
        }
        return (
          <div className="flex gap-3">
            <EditAddItemDialog item={mapped} onSubmitAction={(item) => handleOnEdit(row.index, item)} isSubmitting={false} />
            <Button
              type="button"
              variant="destructive"
              className="h-12 min-w-12"
              size="lg"
              onClick={() => onRemove(row.index)}
            >
              <Trash />
            </Button>
          </div>
        )
      },
    }),
  ])
}
