import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { EditItemRequest, Item } from "@/app/api/types"
import { FormProvider, useForm } from "react-hook-form"
import { toast, Toaster } from "../ui/toast"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { editItemSchema } from "./create-edit-item-schema"
import { Spinner } from "../ui/spinner"

export function EditItemDialog({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="icon-sm" />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
        </DialogHeader>
        <EditItemForm
          item={item}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function EditItemForm({ item, onSuccess }: { item: Item, onSuccess: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const form = useForm<EditItemRequest>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      id: item.id,
      name: item.name,
      type: item.type,
      brand: item.brand,
      unit: item.unit,
      base_price: item.base_price,
      sell_price: item.sell_price
    }
  })
  const router = useRouter()

  const onValid = async (data: EditItemRequest) => {
    const payload = {
      id: data.id,
      name: data.name,
      type: data.type,
      brand: data.brand,
      unit: data.unit,
      base_price: data.base_price,
      sell_price: data.sell_price
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to update item");
      }
      toast.add({
        title: "Updated item data"
      })
      router.refresh()
      setSubmitting(false)
      onSuccess();
    } catch (e) {
      console.error(e);
      toast.add({
        title: "Error",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
      setSubmitting(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            aria-invalid={!!form.formState.errors.name}
            {...form.register("name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            aria-invalid={!!form.formState.errors.type}
            {...form.register("type")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            aria-invalid={!!form.formState.errors.brand}
            {...form.register("brand")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            aria-invalid={!!form.formState.errors.unit}
            {...form.register("unit")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="base_price">Base Price</Label>
          <Input
            id="base_price"
            type="number"
            aria-invalid={!!form.formState.errors.base_price}
            {...form.register("base_price", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Sell Price</Label>
          <Input
            id="sell_price"
            type="number"
            aria-invalid={!!form.formState.errors.sell_price}
            {...form.register("sell_price", { valueAsNumber: true })}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
      <Toaster />
    </FormProvider>
  )
}
