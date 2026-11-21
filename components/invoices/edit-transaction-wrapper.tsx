"use client"
import { EditAddItemModel, TransactionRecord } from "@/app/api/types";
import { EditAddItemDialog } from "./edit-add-item-dialog";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EditTransactionWrapper({ item, transaction }: { item: EditAddItemModel, transaction: TransactionRecord }) {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const handleSubmit = async (item: EditAddItemModel) => {
    const payload = {
      record_id: transaction.id,
      price_snapshot: item.price_snapshot,
      item_id: item.item_id,
      quantity: item.quantity,
      discounts: item.discounts.map((discount) => ({
        discount_record_id: discount.id,
        discount_type: discount.type,
        discount_value: discount.value
      })),
      discounts_to_delete: item.discount_ids_to_delete,
      discounts_to_add: item.discounts_to_add.map((discount) => ({
        discount_type: discount.type,
        discount_value: discount.value
      }))
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to update transaction");
      }
      toast.add({
        title: "Updated transaction data"
      })
      router.refresh()
    } catch (e) {
      console.error(e);
      toast.add({
        title: "Error",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
    }

    setSubmitting(false)
  }
  return (
    <EditAddItemDialog item={item} onSubmitAction={handleSubmit} isSubmitting={submitting} />
  )
}
