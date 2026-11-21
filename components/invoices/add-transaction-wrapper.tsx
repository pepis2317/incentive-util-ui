"use client"
import { EditAddItemModel } from "@/app/api/types";
import { EditAddItemDialog } from "./edit-add-item-dialog";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddTransactionWrapper({ invoiceId }: { invoiceId: number }) {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const handleSubmit = async (item: EditAddItemModel) => {
    const payload = {
      invoice_id: invoiceId,
      item_id: item.item_id,
      price_snapshot: item.price_snapshot,
      quantity: item.quantity,
      discounts: item.discounts_to_add.map((discount) => ({
        discount_type: discount.type,
        discount_value: discount.value,
        discount_step: discount.step
      })),
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to add transaction");
      }

      toast.add({
        title: "Added transaction data"
      })
      router.refresh()
    } catch (e) {
      toast.add({
        title: "Error",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
    }
    setSubmitting(false)
  }
  return (
    <EditAddItemDialog item={null} onSubmitAction={handleSubmit} isSubmitting={submitting} />
  )
}
