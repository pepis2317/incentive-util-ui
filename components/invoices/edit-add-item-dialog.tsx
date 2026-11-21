"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Pencil, Plus, X } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { EditAddItemModel, GetItemsResponse } from "@/app/api/types"
import { Controller, FormProvider, useFieldArray, UseFieldArrayReturn, useForm, UseFormReturn } from "react-hook-form"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { editAddItemSchema } from "./edit-add-item-schema"

export function EditAddItemDialog({ item, onSubmitAction, isSubmitting }: { item: EditAddItemModel | null, onSubmitAction: (item: EditAddItemModel) => Promise<void>, isSubmitting: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-12 min-w-12" size="lg" />}>
        {item != null ?
          <Pencil /> :
          <>
            <Plus />
            Add Item
          </>
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item != null ? 'Edit' : 'Add'} transaction</DialogTitle>
        </DialogHeader>
        <ScrollArea className={"max-h-[500px] w-full"}>
          <div className="p-1 pe-4">
            <EditAddItemForm
              item={item}
              isSubmitting={isSubmitting}
              onSuccess={async (item) => {
                await onSubmitAction(item)
                setOpen(false)
              }}
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
  {
    form: UseFormReturn<EditAddItemModel>,
    fieldArray: UseFieldArrayReturn<EditAddItemModel>,
    isNew: boolean
    onRemove: (index: number) => void
  }
) {
  return (
    <div className="space-y-2">
      {fieldArray.fields.map((field, index) => {

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
                  size="icon-lg"
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
                  name={`${which}.${index}.type`}
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
                <Controller
                  control={form.control}
                  name={`${which}.${index}.value`}
                  render={({ field, fieldState }) => (
                    <Input
                      id={`${which}.${index}.value`}
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
            </CardContent>
          </Card>
        )
      })
      }
    </div>

  )
}

function EditAddItemForm({ item, onSuccess, isSubmitting }: { item: EditAddItemModel | null, onSuccess: (item: EditAddItemModel) => void, isSubmitting: boolean }) {
  const [itemSearch, setItemSearch] = useState("")
  const form = useForm<EditAddItemModel>({
    resolver: zodResolver(editAddItemSchema),
    defaultValues: {
      item_name: item?.item_name ?? "",
      item_id: item?.item_id ?? "",
      quantity: item?.quantity ?? 0,
      price_snapshot: item?.price_snapshot ?? 0,
      discounts: item?.discounts ?? [],
      discount_ids_to_delete: item?.discount_ids_to_delete ?? [],
      discounts_to_add: item?.discounts_to_add ?? []
    }
  })
  const debouncedSearch = useDebounce(itemSearch, 300)
  const { data: itemsResponse = { items: [] }, isFetching: itemsFetching } = useQuery<GetItemsResponse>({
    queryKey: ["items", debouncedSearch],
    queryFn: () => fetch(`/api/items?item_query=${encodeURIComponent(debouncedSearch)}`).then((r) => r.json()),
    placeholderData: keepPreviousData
  })
  const isItemsSearching = itemsFetching || itemSearch != debouncedSearch
  const existing = useFieldArray({ control: form.control, name: "discounts" })
  const added = useFieldArray({ control: form.control, name: "discounts_to_add" })
  const removeExisting = (index: number) => {
    const id = form.getValues(`discounts.${index}.id`)
    form.setValue("discount_ids_to_delete", [
      ...form.getValues("discount_ids_to_delete"),
      id,
    ])
    existing.remove(index)
  }
  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.stopPropagation()
          form.handleSubmit(onSuccess)(e)
        }}
        className="space-y-4"
      >
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
                    field.onChange(v ?? null)
                    if (v) {
                      form.setValue("item_id", v.id, { shouldDirty: true, shouldValidate: true })
                      form.setValue("item_name", v.name, { shouldDirty: true, shouldValidate: true })
                      form.setValue("price_snapshot", v.sell_price, { shouldDirty: true, shouldValidate: true })
                    }
                  }}
                  onInputValueChange={(text, details) => {
                    if (details.reason === "input-change") setItemSearch(text)
                  }}
                >
                  <ComboboxInput
                    placeholder="Select Item"
                    className="w-full h-12"
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>
                      {isItemsSearching ? <Spinner /> : <span> No items found. </span>}
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(i) => (
                        <ComboboxItem className="min-h-12 flex flex-col gap-1 border items-start p-5" key={i.id} value={i}>
                          <Badge variant="outline">
                            {i.id}
                          </Badge>
                          {i.name}
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
          <Controller
            control={form.control}
            name="price_snapshot"
            render={({ field, fieldState }) => (
              <Input
                id="price_snapshot"
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
          <Label htmlFor="name">Quantity</Label>
          <Controller
            control={form.control}
            name="quantity"
            render={({ field, fieldState }) => (
              <Input
                id="quantity"
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
          <div className="flex items-start justify-between">
            <Label>Discounts</Label>
            <Button
              type="button"
              variant="outline"
              className="h-12"
              size="lg"
              onClick={() =>
                added.append({
                  type: "percentage",
                  value: 0,
                  id: -1,
                  step: added.fields.length + 1
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

        <div className="flex justify-end">
          <Button type="submit" className="h-12" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </FormProvider>

  )
}
