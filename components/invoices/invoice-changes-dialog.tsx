"use client"
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { InvoiceSnapshot } from "@/app/api/types";

export function InvoiceChangesDialog({ changes }: { changes: InvoiceSnapshot[] }) {
  const [open, setOpen] = useState(false)
  const sortedChanges = [...changes].sort((a, b) => b.created_at - a.created_at)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="cursor-pointer" variant="outline" />}>
        <AlertTriangle />
        View changes
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice changes</DialogTitle>
        </DialogHeader>
        {sortedChanges.map((change, index) => (
          <div key={index}>
            <div>
              <span>
                {change.transaction_id}
              </span>
              <span>
                {change.customer_id}
              </span>
            </div>
            {change.transaction_record_snapshots.map((snapshot, s_index) => (
              <div key={s_index}>
                <span>
                  {snapshot.item_id}
                </span>
                <span>
                  {snapshot.item.name}
                </span>
                <span>
                  {snapshot.quantity}
                </span>
                <span>
                  {snapshot.undiscounted_price}
                </span>
                <span>
                  {snapshot.discounted_price}
                </span>
                <span>
                  {snapshot.created_at}
                </span>
              </div>
            ))}
          </div>
        ))}

      </DialogContent>
    </Dialog>
  )
}
