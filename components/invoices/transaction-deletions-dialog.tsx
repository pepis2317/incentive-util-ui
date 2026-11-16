"use client"

import { useState } from "react"
import { RecordDeletion } from "./edit-transaction-record-columns"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog"
import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"

const formatEpoch = (epoch: number) => new Date(epoch * 1000).toLocaleString()

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0
})

export function TransactionDeletionsDialog({ deletions }: { deletions: RecordDeletion[] }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="cursor-pointer" variant="outline" />}>
        <AlertTriangle />
        View row deletions
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Deleted Rows</DialogHeader>

      </DialogContent>
    </Dialog>
  )
}
