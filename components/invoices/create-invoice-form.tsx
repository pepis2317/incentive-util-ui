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
import { createInvoiceColumns, RecordAddForm, RecordAddItem } from "./create-invoice-columns"
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form"
import { recordAddSchema } from "./create-invoice-schema"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"

const CUSTOMERS = ["C001", "C002", "C003"]

const emptyItem: RecordAddItem = {
  item_id: "",
  item_quantity: 1,
  price_snapshot: 0,
  discounts: [],
}

export function CreateInvoiceForm({ onSuccess }: { onSuccess: () => void }) {
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

  const columns = React.useMemo(
    () => createInvoiceColumns({ onRemove: remove }),
    [remove]
  )

  const onValid = (data: RecordAddForm) => {
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
    // TODO: send `data` (matches RecordAdd) with a TanStack Query useMutation
    onSuccess()
  }

  const items = form.watch("items") ?? []

  const ids = items.map((item) => item.item_id?.trim()).filter(Boolean)
  const hasDuplicateIds = new Set(ids).size !== ids.length
  const hasEmptyItemId = items.some((item) => !item.item_id?.trim())

  const disableAdd = hasEmptyItemId || hasDuplicateIds
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="transaction_id">Transaction Id</Label>
          <Input
            id="transaction_id"
            aria-invalid={!!form.formState.errors.transaction_id}
            {...form.register("transaction_id")}
          />
        </div>

        <div className="space-y-2">
          <Label>Customer Id</Label>
          <Controller
            control={form.control}
            name="customer_id"
            render={({ field }) => (
              <Combobox
                items={CUSTOMERS}
                value={field.value}
                onValueChange={(v) => v && field.onChange(v)}
              >
                <ComboboxInput placeholder="Select Customer" className="w-full" />
                <ComboboxContent>
                  <ComboboxEmpty>No customers found.</ComboboxEmpty>
                  <ComboboxList>
                    {(c) => (
                      <ComboboxItem key={c} value={c}>
                        {c}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
        </div>

        <div className="space-y-2">
          <DataTable columns={columns} data={fields} enablePagination={false} getRowId={(row) => row.item_id} />
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

        <Button type="submit">Save</Button>
      </form>
    </FormProvider>
  )
}
