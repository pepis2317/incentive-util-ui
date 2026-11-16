import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { invoiceColumns } from "@/components/invoices/invoice-columns"
import { TableSearch } from "@/components/table-search"
import { DataTable } from "@/components/data-table"
import Link from "next/link"
import { ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GetInvoicesParams } from "../api/types"
import { getInvoices } from "../api/endpoints"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toast"

async function InvoiceContent({ searchParams }: { searchParams: Promise<GetInvoicesParams> }) {
  const params = await searchParams
  const data = await getInvoices(params)
  return (
    <div>
      <div className="flex gap-2">
        <TableSearch query="transaction_id_query" />
        <Button type="submit" render={<Link href="/invoices/create" />} nativeButton={false}>
          <ScrollText />
          Create New Invoice
        </Button>
      </div>
      <DataTable columns={invoiceColumns} data={data.invoices} />
      <Toaster />
    </div>
  )
}
function InvoicesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-xs h-10" />
      <Skeleton className="w-lg h-16" />
      <Skeleton className="w-full h-52" />
    </div>
  )
}
export default async function Invoices({ searchParams }: { searchParams: Promise<GetInvoicesParams> }) {
  return (
    <div>
      <Suspense fallback={<InvoicesSkeleton />}>
        <AppBreadcrumb />
        <InvoiceContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
