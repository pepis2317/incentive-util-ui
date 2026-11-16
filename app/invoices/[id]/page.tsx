import { getTransactionRecords } from "@/app/api/endpoints";
import { GetTransactionRecordParams } from "@/app/api/types";
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { DataTable } from "@/components/data-table"
import { AddTransactionDialog } from "@/components/invoices/add-transaction-dialog";
import { EditInvoiceDialog } from "@/components/invoices/edit-invoice-dialog";
import { RecordColumns } from "@/components/invoices/edit-transaction-record-columns";
import { InvoiceChangesDialog } from "@/components/invoices/invoice-changes-dialog";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toast";
import { Suspense } from "react"

async function InvoiceContent({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<GetTransactionRecordParams> }) {
  const { id } = await params
  const idNumber = Number(id)
  const query = await searchParams
  const data = await getTransactionRecords({ ...query, id: idNumber })
  return (
    <div>
      <div className="">
        <Card size="sm" className="w-sm mb-5">
          <CardHeader>
            <CardTitle>
              Invoice info
            </CardTitle>
            <CardAction>
              <EditInvoiceDialog invoice={data.invoice} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>
                Transaction Id:
              </Label>
              {data.invoice.transaction_id}
            </div>
            <div className="space-y-2">
              <Label>
                Customer:
              </Label>
              {data.invoice.customer.name}
            </div>
          </CardContent>
        </Card>
        <AddTransactionDialog invoiceId={idNumber} />
      </div>
      <DataTable columns={RecordColumns} data={data.invoice.transaction_records} enablePagination={false} />
      <InvoiceChangesDialog changes={data.invoice.invoice_snapshots} />
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
