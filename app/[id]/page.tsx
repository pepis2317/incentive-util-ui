import { getTransactionRecords } from "@/app/api/endpoints";
import { GetTransactionRecordParams } from "@/app/api/types";
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { DataTable } from "@/components/data-table"
import { AddTransactionDialog } from "@/components/invoices/add-transaction-dialog";
import { EditInvoiceDialog } from "@/components/invoices/edit-invoice-dialog";
import { RecordColumns } from "@/components/invoices/edit-transaction-record-columns";
import { InvoiceChangesButton } from "@/components/invoices/invoice-changes-button";
import { invoiceChangesColumns } from "@/components/invoices/invoice-changes-columns";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toast";
import { AlertTriangle, ReceiptText } from "lucide-react";
import { Suspense } from "react"

async function InvoiceContent({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<GetTransactionRecordParams> }) {
  const { id } = await params
  const idNumber = Number(id)
  const query = await searchParams
  const data = await getTransactionRecords({ ...query, id: idNumber })
  return (
    <div>
      <div className="">
        <Card size="sm" className="max-w-xs mb-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="size-4 text-muted-foreground" />
              Invoice info
            </CardTitle>
            <CardAction>
              <EditInvoiceDialog invoice={data.invoice} />
            </CardAction>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Transaction ID
              </Label>
              {data.invoice.transaction_id}
            </div>

            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Customer
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {data.invoice.customer.name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <DataTable columns={RecordColumns} data={data.invoice.transaction_records} enablePagination={false} />
        <AddTransactionDialog invoiceId={idNumber} />
        <InvoiceChangesButton changes={data.invoice.invoice_snapshots} />
      </div>
      <Toaster />
    </div>
  )
}

export default async function EditInvoice({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<GetTransactionRecordParams> }) {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <AppBreadcrumb />
        <InvoiceContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
