import { EditTransactionRequest, GetItemsResponse, Item, ItemResponse, TransactionRecord } from "@/app/api/types";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Controller, FormProvider, useFieldArray, UseFieldArrayReturn, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editTransactionSchema } from "./edit-transaction-schema";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Spinner } from "../ui/spinner";
import { toast, Toaster } from "../ui/toast";
import { Badge } from "../ui/badge";

export function EditTransactionDialog({ transaction }: { transaction: TransactionRecord }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="icon-sm" />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
        </DialogHeader>
        <ScrollArea className={"max-h-[500px] w-full"}>
          <div className="p-1 pe-4">
            <EditTransactionForm
              transaction={transaction}
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

function DiscountsCard({ form, fieldArray, isNew, onRemove }:
  { form: UseFormReturn<EditTransactionRequest>, fieldArray: UseFieldArrayReturn<EditTransactionRequest>, isNew: boolean, onRemove: (index: number) => void }) {
  return (
    <div className="space-y-2">
      {fieldArray.fields.map((field, index) => {
        const itemErrors = form.formState.errors.discounts?.[index]
        const which = isNew ? 'discounts_to_add' : 'discounts'
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
                  name={`${which}.${index}.discount_type`}
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
                <Label htmlFor={`${which}.${index}.discount_value`}>Discount Value</Label>
                <Input
                  id={`${which}.${index}.discount_value`}
                  type="number"
                  step="any"
                  aria-invalid={!!itemErrors?.discount_value}
                  {...form.register(`${which}.${index}.discount_value`, { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>
        )
      })
      }
    </div>

  )
}

function EditTransactionForm({ transaction, onSuccess }: { transaction: TransactionRecord, onSuccess: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const [itemSearch, setItemSearch] = useState("")
  const form = useForm<EditTransactionRequest>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      record_id: transaction.id,
      price_snapshot: transaction.price_snapshot,
      item_id: transaction.item_id,
      quantity: transaction.quantity,
      discounts: transaction.discount_records.map((discount) => ({
        discount_record_id: discount.id,
        discount_type: discount.type as "percentage" | "flat",
        discount_value: discount.value
      })),
      discounts_to_delete: [],
      discounts_to_add: []
    }
  })
  const debouncedSearch = useDebounce(itemSearch, 300)
  const { data: itemsResponse = { items: [] }, isLoading: itemsLoading } = useQuery<GetItemsResponse>({
    queryKey: ["items", debouncedSearch],
    queryFn: () => fetch(`/api/items?item_query=${encodeURIComponent(debouncedSearch)}`).then((r) => r.json()),
    placeholderData: keepPreviousData
  })

  const existing = useFieldArray({ control: form.control, name: "discounts" })
  const added = useFieldArray({ control: form.control, name: "discounts_to_add" })

  const removeExisting = (index: number) => {
    const id = form.getValues(`discounts.${index}.discount_record_id`)
    form.setValue("discounts_to_delete", [
      ...form.getValues("discounts_to_delete"),
      id,
    ])
    existing.remove(index)
  }

  const router = useRouter()
  const onValid = async (data: EditTransactionRequest) => {
    const payload = {
      record_id: data.record_id,
      price_snapshot: data.price_snapshot,
      item_id: data.item_id,
      quantity: data.quantity,
      discounts: data.discounts,
      discounts_to_delete: data.discounts_to_delete,
      discounts_to_add: data.discounts_to_add
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
          <Label>Item Id</Label>
          <Controller
            control={form.control}
            name="item_id"
            render={({ field, fieldState }) => (
              <Combobox
                items={itemsResponse.items}
                value={field.value}
                onValueChange={(v) => field.onChange(v ?? "")}
                onInputValueChange={setItemSearch}
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
                      <ComboboxItem key={i.id} value={i.id}>
                        <Badge variant="outline">
                          {i.id}
                        </Badge>
                        {i.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
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
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add discount
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <DiscountsCard form={form} fieldArray={existing} isNew={false} onRemove={removeExisting} />
          <DiscountsCard form={form} fieldArray={added} isNew={true} onRemove={added.remove} />
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
