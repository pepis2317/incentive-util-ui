import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { Customer } from "@/app/api/types"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editCustomerSchema } from "./create-edit-customer-schema"
import { EditCustomerRequest } from "@/app/api/types"
import { toast, Toaster } from "../ui/toast"
import { useRouter } from "next/navigation"
import { Spinner } from "../ui/spinner"

export function EditCustomerDialog({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="icon-sm" />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {customer.name}</DialogTitle>
        </DialogHeader>
        <EditCustomerForm
          customer={customer}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function EditCustomerForm({ customer, onSuccess }: { customer: Customer, onSuccess: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const form = useForm<EditCustomerRequest>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      id: customer.id,
      name: customer.name,
      type_id: customer.type_id
    }
  })

  const router = useRouter()

  const onValid = async (data: EditCustomerRequest) => {
    const payload = {
      id: data.id,
      type_id: data.type_id,
      name: data.name
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to update customer");
      }

      toast.add({
        title: "Updated customer data"
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            aria-invalid={!!form.formState.errors.name}
            {...form.register("name")}
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
