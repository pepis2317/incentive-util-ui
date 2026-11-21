import { getTransactionRecords } from "@/app/api/endpoints";
import { DiscountRecord, GetTransactionRecordParams } from "@/app/api/types";
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { DataTable } from "@/components/data-table"
import { AddTransactionWrapper } from "@/components/invoices/add-transaction-wrapper";
import { DiscountRecordsCell } from "@/components/invoices/discount-records-cell";
import { EditInvoiceDialog } from "@/components/invoices/edit-invoice-dialog";
import { RecordColumns } from "@/components/invoices/edit-transaction-record-columns";
import { InvoiceChangesButton } from "@/components/invoices/invoice-changes-button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toast";
import { ReceiptText } from "lucide-react";
import { Suspense } from "react"

function applyDiscount(price: number, discounts: DiscountRecord[]) {
  let total = price
  discounts.forEach(discount => {
    if (discount.type == "flat") {
      total -= discount.value
    }
    else if (discount.type == "percentage") {
      total -= total * (discount.value / 100)
    }
  })
  return total
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0
})

async function InvoiceContent({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<GetTransactionRecordParams> }) {
  const { id } = await params
  const idNumber = Number(id)
  const query = await searchParams
  const data = await getTransactionRecords({ ...query, id: idNumber })
  const calculateTotal = () => {
    let total = 0
    data.invoice.transaction_records.forEach((record) => {
      total += applyDiscount(record.price_snapshot, record.discount_records) * record.quantity
    })
    return total
  }
  return (
    <div className="space-y-4">
      <div>
        <Card size="sm" className="max-w-lg">
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
      <div className="space-y-4">
        <DataTable columns={RecordColumns} data={data.invoice.transaction_records} enablePagination={false} />
        <AddTransactionWrapper invoiceId={idNumber} />
        {data.invoice.transaction_records.length > 0 && (
          <div className="flex flex-col items-end w-full space-y-4">
            <span className="flex items-start w-full border-t-2 pt-4">Summary</span>
            <Card size="sm" className="p-4 flex items-end w-full">
              <div className="w-full">
                Customer:
                <div>
                  {data.invoice.customer.name}
                </div>
              </div>
              <div className="w-full grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 border-b pb-2 text-sm font-medium">
                <div>Item</div>
                <div className="text-right">Price</div>
                <div className="text-right">Qty</div>
                <div className="text-right">Total</div>
              </div>
              {data.invoice.transaction_records.map((record, recordIndex) => {
                return (
                  <div key={recordIndex} className="w-full border-b py-2">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2">
                      <span>
                        {record.item.name}
                      </span>
                      <div className="text-right tabular-nums">{currencyFormatter.format(Math.round(record.price_snapshot))}</div>
                      <div className="text-right tabular-nums">{record.quantity}</div>
                      <div className="text-right tabular-nums">
                        {currencyFormatter.format(Math.round(record.quantity * record.price_snapshot))}
                      </div>
                    </div>

                    {record.discount_records.length > 0 && (
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2 text-sm text-muted-foreground">
                        <div className="col-span-3 flex items-center gap-2">
                          <span>Disc.</span>
                          <DiscountRecordsCell discountRecords={record.discount_records} />
                        </div>
                        <div className="text-right tabular-nums">
                          {currencyFormatter.format(
                            Math.round(-(record.price_snapshot - applyDiscount(record.price_snapshot, record.discount_records)) * record.quantity))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div>
                Total: {currencyFormatter.format(calculateTotal())}
              </div>
            </Card>
          </div>
        )}
        {data.invoice.invoice_snapshots.length > 0 && (
          <InvoiceChangesButton changes={data.invoice.invoice_snapshots} />
        )}
      </div>
      <Toaster />
    </div>
  )
}

function EditInvoiceSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-xs h-10" />
      <Skeleton className="w-xs h-32" />
      <Skeleton className="w-full h-32" />
    </div>
  )
}

export default async function EditInvoice({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<GetTransactionRecordParams> }) {
  return (
    <div>
      <Suspense fallback={<EditInvoiceSkeleton />}>
        <AppBreadcrumb />
        <InvoiceContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
