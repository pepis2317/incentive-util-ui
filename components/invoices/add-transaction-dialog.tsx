"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Pencil, Plus, X } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { zodResolver } from "@hookform/resolvers/zod"
import { addTransactionSchema } from "./add-transaction-schema"
import { Controller, FormProvider, useFieldArray, UseFieldArrayReturn, useForm, UseFormReturn } from "react-hook-form"
import { AddTransactionRequest, GetItemsResponse, Item } from "@/app/api/types"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "../ui/toast"
import { Label } from "../ui/label"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Input } from "../ui/input"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Spinner } from "../ui/spinner"

export function AddTransactionDialog({ invoiceId }: { invoiceId: number }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Pencil />
        Add new transaction item
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <ScrollArea className={"max-h-[500px] w-full"}>
          <div className="p-1 pe-4">
            <AddTransactionForm
              invoiceId={invoiceId}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "flat", label: "Fixed amount" },
]


function DiscountsCard({ form, fieldArray, onRemove }:
  { form: UseFormReturn<AddTransactionRequest>, fieldArray: UseFieldArrayReturn<AddTransactionRequest>, onRemove: (index: number) => void }) {
  return (
    <div className="space-y-2">
      {fieldArray.fields.map((field, index) => {
        const itemErrors = form.formState.errors.discounts?.[index]
        return (
          <Card key={field.id} size="sm">
            <CardHeader>
              <CardTitle>
                <span>
                  Step {index + 1}
                </span>
              </CardTitle>
              <CardAction>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onRemove(index)}
                  aria-label="Remove discount"
                >
                  <X />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex items-start gap-2 pt-6">
              <div className="flex-1 space-y-2">
                <Label>Discount Type</Label>
                <Controller
                  control={form.control}
                  name={`discounts.${index}.discount_type`}
                  render={({ field: f, fieldState }) => (
                    <>
                      <Select
                        value={f.value != null ? String(f.value) : ""}
                        onValueChange={(v) => f.onChange(v)}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select a type">
                            {DISCOUNT_TYPES.find((t) => t.value === f.value)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {DISCOUNT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`discounts.${index}.discount_value`}>Discount Value</Label>
                <Input
                  id={`discounts.${index}.discount_value`}
                  type="number"
                  step="any"
                  aria-invalid={!!itemErrors?.discount_value}
                  {...form.register(`discounts.${index}.discount_value`, { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>
        )
      })}

    </div>
  )
}
function AddTransactionForm({ invoiceId, onSuccess }: { invoiceId: number, onSuccess: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const [itemSearch, setItemSearch] = useState("")
  const form = useForm<AddTransactionRequest>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      invoice_id: invoiceId,
      item_id: "",
      price_snapshot: 0,
      quantity: 0
    }
  })
  const debouncedSearch = useDebounce(itemSearch, 300)
  const { data: itemsResponse = { items: [] }, isLoading: itemsLoading } = useQuery<GetItemsResponse>({
    queryKey: ["items", debouncedSearch],
    queryFn: () => fetch(`/api/items?item_query=${encodeURIComponent(debouncedSearch)}`).then((r) => r.json()),
    placeholderData: keepPreviousData
  })
  const added = useFieldArray({ control: form.control, name: "discounts" })
  const router = useRouter()
  const onValid = async (data: AddTransactionRequest) => {
    const payload = {
      invoice_id: data.invoice_id,
      item_id: data.item_id,
      price_snapshot: data.price_snapshot,
      quantity: data.quantity,
      discounts: data.discounts.map((discount) => ({
        discount_type: discount.discount_type,
        discount_value: discount.discount_value,
        discount_step: discount.discount_step
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
          <Label>Item</Label>
          <Controller
            control={form.control}
            name="item_id"
            render={({ field, fieldState }) => {
              const current =
                itemsResponse.items.find((i) => i.id === field.value) ?? null
              return (
                <Combobox
                  items={itemsResponse.items}
                  value={current}
                  isItemEqualToValue={(a, b) => a.id === b.id}
                  itemToStringLabel={(i) => i.name}
                  filter={null}
                  onValueChange={(v) => {
                    field.onChange(v?.id ?? "")
                    form.setValue(`price_snapshot`, v?.sell_price ?? 0)
                  }}
                  onInputValueChange={(text, details) => {
                    if (details.reason === "input-change") setItemSearch(text)
                  }}
                  disabled={itemsLoading}
                >
                  <ComboboxInput
                    placeholder="Select Item"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(i) => (
                        <ComboboxItem key={i.id} value={i}>
                          {i.id} {i.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Price Snapshot</Label>
          <Input
            id="price_snapshot"
            type="number"
            aria-invalid={!!form.formState.errors.price_snapshot}
            {...form.register("price_snapshot", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            aria-invalid={!!form.formState.errors.quantity}
            {...form.register("quantity", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Discounts</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                added.append({
                  discount_type: "percentage",
                  discount_value: 0,
                  discount_step: added.fields.length + 1
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add discount
            </Button>
          </div>
          <div className="space-y-2">
            <DiscountsCard form={form} fieldArray={added} onRemove={added.remove} />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
      <Toaster />
    </FormProvider>
  )

}
