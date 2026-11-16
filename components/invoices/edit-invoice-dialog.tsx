"use client"
import { EditInvoiceRequest, GetCustomersResponse, InvoiceResponse } from "@/app/api/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editInvoiceSchema } from "./edit-invoice-schema";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "../ui/toast";
import { Spinner } from "../ui/spinner";

export function EditInvoiceDialog({ invoice }: { invoice: InvoiceResponse }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="icon-sm" />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit invoice</DialogTitle>
        </DialogHeader>
        <EditInvoiceForm
          invoice={invoice}
          onSuccess={() => setOpen(false)}
        />
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

function EditInvoiceForm({ invoice, onSuccess }: { invoice: InvoiceResponse, onSuccess: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")
  const form = useForm<EditInvoiceRequest>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      id: invoice.id,
      transaction_id: invoice.transaction_id,
      customer_id: invoice.customer_id
    }
  })
  const debouncedSearch = useDebounce(customerSearch, 300)
  const { data: customersResponse = { customers: [] }, isLoading: customersLoading } = useQuery<GetCustomersResponse>({
    queryKey: ["items", debouncedSearch],
    queryFn: () => fetch(`/api/customers?customer_query=${encodeURIComponent(debouncedSearch)}`).then((r) => r.json()),
    placeholderData: keepPreviousData
  })
  const router = useRouter()
  const onValid = async (data: EditInvoiceRequest) => {
    const payload = {
      id: data.id,
      transaction_id: data.transaction_id,
      customer_id: data.customer_id
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to update invoice");
      }

      toast.add({
        title: "updated invoice data"
      })
      router.refresh()
      setSubmitting(false)
      onSuccess();
    } catch (e) {
      console.error(e);
      toast.add({
        title: "Update error",
        description: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
      setSubmitting(false)
    }
  }
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Id</Label>
          <Input
            id="transaction_id"
            aria-invalid={!!form.formState.errors.transaction_id}
            {...form.register("transaction_id")}
          />
        </div>
        <div className="space-y-2">
          <Label>Customer</Label>
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
                  placeholder="Select Item"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                  onBlur={field.onBlur}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No customers found.</ComboboxEmpty>
                  <ComboboxList>
                    {(i) => (
                      <ComboboxItem key={i.id} value={i.id}>
                        {i.id} {i.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
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
