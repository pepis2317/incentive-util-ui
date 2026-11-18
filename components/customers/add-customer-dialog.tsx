"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { AddCustomerRequest } from "@/app/api/types"
import { editCustomerSchema } from "./create-edit-customer-schema"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "../ui/toast"
import { Spinner } from "../ui/spinner"

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <User />
        Add Customer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <AddCustomerForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function AddCustomerForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const form = useForm<AddCustomerRequest>({
    resolver: zodResolver(editCustomerSchema)
  })

  const router = useRouter()

  const onValid = async (data: AddCustomerRequest) => {
    const payload = {
      id: data.id,
      name: data.name
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Failed to add customer");
      }

      toast.add({
        title: "Added customer"
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Saving..." : "Add new customer"}
          </Button>
        </div>
      </form>
      <Toaster />
    </FormProvider>
  )
}
