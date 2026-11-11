import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { Invoice } from "./invoice-columns"

export function EditInvoiceDialog({ invoice }: { invoice: Invoice }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {invoice.transaction_id}</DialogTitle>
        </DialogHeader>
        <EditInvoiceForm
          invoice={invoice}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function EditInvoiceForm({ invoice, onSuccess }: { invoice: Invoice, onSuccess: () => void }) {
  const [transactionId, setTransactionId] = useState(invoice.transaction_id)

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    // TODO: save { name, type } here using tools from tanstack
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Transaction Id</Label>
        <Input
          id="transaction_id"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
      </div>

      <Button type="submit">Save</Button>
    </form>
  )
}
