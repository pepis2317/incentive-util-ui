"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { AlertTriangle, Clock } from "lucide-react"
import { InvoiceSnapshot } from "@/app/api/types"
import { DataTable } from "../data-table"
import { invoiceChangesColumns } from "./invoice-changes-columns"
import { format } from "date-fns"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"

export function InvoiceChangesButton({ changes }: { changes: InvoiceSnapshot[] }) {
  const [open, setOpen] = useState(false)
  const sortedChanges = [...changes].sort((a, b) => b.created_at - a.created_at)
  const formatEpoch = (epoch: number) => new Date(epoch * 1000).toLocaleString()
  return (
    <div>
      <Button className="cursor-pointer" variant="outline" onClick={() => setOpen(!open)}>
        <AlertTriangle />
        View changes
      </Button>
      <div className={`space-y-5 mt-5 ${open ? "block" : "hidden"}`}>
        {sortedChanges.map((change, index) => (
          <div className="space-y-2" key={index}>
            <div className="space-y-2" key={index}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Snapshot at {format(formatEpoch(change.created_at), "LLL d, y, HH:mm")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="font-mono">
                    {change.transaction_id}
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    {change.customer_id}
                  </Badge>
                </div>
              </div>

              <DataTable
                columns={invoiceChangesColumns}
                data={change.transaction_record_snapshots}
                enablePagination={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}
