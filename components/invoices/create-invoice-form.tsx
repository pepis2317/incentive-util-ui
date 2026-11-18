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
import { recordAddSchema } from "./create-invoice-schema"
import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { GetCustomersResponse, RecordAddForm, RecordAddItem } from "@/app/api/types"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "../ui/toast"
import { Spinner } from "../ui/spinner"
import { Badge } from "../ui/badge"

const emptyItem: RecordAddItem = {
  item_id: "",
  item_quantity: 1,
  price_snapshot: 0,
  discounts: [],
}

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function CreateInvoiceForm() {
  const [isSubmitting, setSubmitting] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")
  const form = useForm<RecordAddForm>({
    resolver: zodResolver(recordAddSchema),
    defaultValues: {
      customer_id: "",
      transaction_id: "",
      items: [emptyItem],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const debouncedSearch = useDebounce(customerSearch, 300)
  const { data: customersResponse = { customers: [] }, isLoading: customersLoading } = useQuery<GetCustomersResponse>({
    queryKey: ["customers", debouncedSearch],
    queryFn: () => fetch(`/api/customers?customer_query=${encodeURIComponent(debouncedSearch)}`).then((r) => r.json()),
    placeholderData: keepPreviousData
  })

  const columns = React.useMemo(
    () => createInvoiceColumns({ onRemove: remove }),
    [remove]
  )

  const router = useRouter()
  const onValid = async (data: RecordAddForm) => {
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
      router.push("/")
    } catch (e) {
      toast.add({
        title: "Error",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
      setSubmitting(false)
    }
  }

  const items = form.watch("items") ?? []

  const ids = items.map((item) => item.item_id?.trim()).filter(Boolean)
  const hasDuplicateIds = new Set(ids).size !== ids.length
  const hasEmptyItemId = items.some((item) => !item.item_id?.trim())

  const disableAdd = hasEmptyItemId || hasDuplicateIds
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
        <div className="space-y-2 max-w-md">
          <Label htmlFor="transaction_id">Transaction Id</Label>
          <Input
            id="transaction_id"
            aria-invalid={!!form.formState.errors.transaction_id}
            className="uppercase"
            {...form.register("transaction_id", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase()
              },
            })}
          />
        </div>

        <div className="space-y-2 max-w-md">
          <Label>Customer Id</Label>
          <Controller
            control={form.control}
            name="customer_id"
            render={({ field, fieldState }) => (
              <Combobox
                items={customersResponse.customers}
                value={field.value}
                onValueChange={(v) => field.onChange(v ?? "")}
                onInputValueChange={setCustomerSearch}
                disabled={customersLoading}
              >
                <ComboboxInput
                  placeholder="Select Customer"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                  onBlur={field.onBlur}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No customers found.</ComboboxEmpty>
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
          <DataTable columns={columns} data={fields} enablePagination={false} getRowId={(row) => row.id} />
          {form.formState.errors.items?.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.items.root.message}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={disableAdd}
            onClick={() => append(emptyItem)}
          >
            Add item
          </Button>
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
