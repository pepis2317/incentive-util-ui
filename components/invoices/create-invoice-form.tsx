"use client"
import { Button } from "@/components/ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { DataTable } from "../data-table"
import { createInvoiceColumns } from "./create-invoice-columns"
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form"
import { invoiceAddSchema } from "./create-invoice-schema"
import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { DiscountRecord, EditAddItemModel, GetCustomersResponse, InvoiceAddForm, InvoiceAddItem } from "@/app/api/types"
import { useRouter } from "next/navigation"
import { toast } from "../ui/toast"
import { Spinner } from "../ui/spinner"
import { Badge } from "../ui/badge"
import { EditAddItemDialog } from "./edit-add-item-dialog"
import { DiscountRecordsCell } from "./discount-records-cell"
import { Card, CardTitle } from "../ui/card"

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

function applyDiscount(price: number, discounts: DiscountRecord[]) {
  let total = price
  discounts.forEach(discount => {
    if (discount.type == "flat") {
      total -= discount.value
    }
    else if (discount.type == "percentage") {
      total -= total * (discount.value / 100)
    }
  })
  return total
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0
})

export function CreateInvoiceForm({ type }: { type: string }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")
  const form = useForm<InvoiceAddForm>({
    resolver: zodResolver(invoiceAddSchema),
    defaultValues: {
      customer_name: "",
      customer_id: "",
      transaction_id: type == "sell_out" ? null : "",
      type: type,
      items: [],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const debouncedSearch = useDebounce(customerSearch, 300)
  const { data: customersResponse = { customers: [] }, isFetching: customersFetching } = useQuery<GetCustomersResponse>({
    queryKey: ["customers", debouncedSearch],
    queryFn: () => fetch(`/api/customers?customer_query=${encodeURIComponent(debouncedSearch)}`).then((r) => r.json()),
    placeholderData: keepPreviousData
  })
  const isCustomersSearching = customersFetching || customerSearch != debouncedSearch

  const columns = React.useMemo(
    () =>
      createInvoiceColumns({
        onRemove: remove,
        onEdit: (index, item) => update(index, item),
      }),
    [remove, update]
  )

  const router = useRouter()
  const onValid = async (data: InvoiceAddForm) => {
    const payload = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        discounts: item.discounts.map((d, i) => ({
          ...d,
          discount_step: i + 1
        }))
      }))
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to add customer");
      }
      setSubmitting(false)
      form.reset()
      router.push(type == "sell_out" ? "/" : "/sell-in")
    } catch (e) {
      toast.add({
        title: "Error",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
      setSubmitting(false)
    }
  }

  const handleAddItem = async (item: EditAddItemModel) => {
    const exists = fields.some((f) => f.item_id === item.item_id)

    if (exists) {
      toast.add({
        title: "Error",
        description: "Item already exists in list"
      });
      return
    }
    const mapped = {
      item_name: item.item_name,
      item_id: item.item_id,
      item_quantity: item.quantity,
      price_snapshot: item.price_snapshot,
      discounts: item.discounts_to_add.map((discount) => ({
        discount_type: discount.type,
        discount_value: discount.value,
        discount_step: discount.step
      }))
    }
    append(mapped)
  }

  const mapItemDiscounts = (item: InvoiceAddItem) => {
    return item.discounts.map((discount, index) => ({
      id: index,
      transaction_record_id: -1,
      type: discount.discount_type,
      step: discount.discount_step,
      value: discount.discount_value,
      created_at: -1,
      updated_at: null,
    }))

  }

  const calculateTotal = () => {
    let total = 0
    form.getValues().items.forEach((item) => {
      const mappedDiscounts = mapItemDiscounts(item)
      total += applyDiscount(item.price_snapshot, mappedDiscounts) * item.item_quantity
    })
    return total
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
        {type != "sell_out" && (
          <div className="space-y-2 max-w-md">
            <Label>Invoice Id</Label>
            <Input
              id="transaction_id"
              aria-invalid={!!form.formState.errors.transaction_id}
              {...form.register("transaction_id", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase()
                },
              })}
            />
          </div>
        )}
        <div className="space-y-2 max-w-md">
          <Label>Customer</Label>
          <Controller
            control={form.control}
            name="customer_id"
            render={({ field, fieldState }) => {
              const current =
                customersResponse.customers.find((i) => i.id === field.value) ?? null
              return (
                <Combobox
                  items={customersResponse.customers}
                  value={current}
                  isItemEqualToValue={(a, b) => a.id === b.id}
                  itemToStringLabel={(i) => i.name}
                  filter={null}
                  onValueChange={(v) => {
                    field.onChange(v ?? null)
                    if (v) {
                      form.setValue("customer_id", v.id, { shouldDirty: true, shouldValidate: true })
                      form.setValue("customer_name", v.name, { shouldDirty: true, shouldValidate: true })
                    }
                  }}
                  onInputValueChange={(text, details) => {
                    if (details.reason === "input-change") setCustomerSearch(text)
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
                      {isCustomersSearching ? <Spinner /> : <span> No customers found. </span>}
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

        <div className="space-y-4">
          <DataTable columns={columns} data={fields} enablePagination={false} getRowId={(row) => row.id} />
          <EditAddItemDialog item={null} onSubmitAction={(item) => handleAddItem(item)} isSubmitting={false} />
        </div>

        {form.getValues().items.length > 0 && (
          <div className="flex flex-col items-end w-full space-y-4">
            <span className="flex items-start w-full border-t-2 pt-4">Summary</span>
            <Card size="sm" className="p-4 flex items-end w-full">
              <div className=" w-full">
                Customer:
                <div>{form.watch("customer_name")}</div>
              </div>
              <div className="w-full grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 border-b pb-2 text-sm font-medium">
                <div>Item</div>
                <div className="text-right">Price</div>
                <div className="text-right">Qty</div>
                <div className="text-right">Total</div>
              </div>
              {form.getValues().items.map((item, itemIndex) => {
                const mappedDiscounts = mapItemDiscounts(item)
                return (
                  <div key={itemIndex} className="w-full border-b py-2">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2">
                      {item.item_name}
                      <div className="text-right tabular-nums">{currencyFormatter.format(Math.round(item.price_snapshot))}</div>
                      <div className="text-right tabular-nums">{item.item_quantity}</div>
                      <div className="text-right tabular-nums">
                        {currencyFormatter.format(Math.round(item.item_quantity * item.price_snapshot))}
                      </div>
                    </div>

                    {mappedDiscounts.length > 0 && (
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2 text-sm text-muted-foreground">
                        <div className="col-span-3 flex items-center gap-2">
                          <span>Disc.</span>
                          <DiscountRecordsCell discountRecords={mappedDiscounts} />
                        </div>
                        <div className="text-right tabular-nums">
                          {currencyFormatter.format(
                            Math.round(-(item.price_snapshot - applyDiscount(item.price_snapshot, mappedDiscounts)) * item.item_quantity))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div>
                Total: {currencyFormatter.format(calculateTotal())}
              </div>
            </Card>
            <Button className="h-12" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  )
}
