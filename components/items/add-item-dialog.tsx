"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package } from "lucide-react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { AddItemRequest } from "@/app/api/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { editItemSchema } from "./create-edit-item-schema"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "../ui/toast"
import { Spinner } from "../ui/spinner"
import { ScrollArea } from "../ui/scroll-area"

export function AddItemDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-12" />}>
        <Package />
        Add Item
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <AddItemForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function AddItemForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const form = useForm<AddItemRequest>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      id: "",
      name: "",
      type: "",
      brand: "",
      unit: "",
      base_price: 0,
      sell_price: 0
    }
  })
  const router = useRouter()

  const onValid = async (data: AddItemRequest) => {
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to add item");
      }

      toast.add({
        title: "Added item data"
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
      <ScrollArea className=" max-h-[500px] pe-4">
        <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Id</Label>
            <Input
              id="id"
              aria-invalid={!!form.formState.errors.id}
              {...form.register("id", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase()
                },
              })}
            />
          </div>
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
            <Controller
              control={form.control}
              name="base_price"
              render={({ field, fieldState }) => (
                <Input
                  id="base_price"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  aria-invalid={fieldState.invalid}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const raw = e.target.value
                    field.onChange(raw === "" ? 0 : Number(raw))
                  }}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Sell Price</Label>
            <Controller
              control={form.control}
              name="sell_price"
              render={({ field, fieldState }) => (
                <Input
                  id="sell_price"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  aria-invalid={fieldState.invalid}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const raw = e.target.value
                    field.onChange(raw === "" ? 0 : Number(raw))
                  }}
                />
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button className="h-12" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Saving..." : "Add new item"}
            </Button>
          </div>
        </form>
      </ScrollArea>

      <Toaster />
    </FormProvider>
  )
}
