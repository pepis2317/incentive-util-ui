import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { Suspense } from "react";
import { DataTable } from "@/components/data-table";
import { Toaster } from "@/components/ui/toast";
import { invoiceColumns } from "@/components/invoices/invoice-columns";
import { TableSearch } from "@/components/table-search";
import { InvoiceDateFilter } from "@/components/invoices/filter-invoices-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { getInvoices } from "../api/endpoints";
import { GetInvoicesParams } from "../api/types";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function SellInContent({ searchParams }: { searchParams: Promise<GetInvoicesParams> }) {
  const params = await searchParams
  const data = await getInvoices({ ...params, type: "sell_in" })
  return (
    <div>
      <div className="space-y-2">
        <div className="flex gap-2 w-fit">
          <InvoiceDateFilter />
          <Button className="min-w-12 h-12" type="submit" render={<Link href={`/sell-in/create`} />} nativeButton={false}>
            <Pencil />
            Add sell in invoice
          </Button>
        </div>
        <TableSearch query="transaction_id_query" />
        <DataTable columns={invoiceColumns} data={data.invoices} rowCount={data.total} />
      </div>
      <Toaster />
    </div>

  )
}
function HomeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-xs h-10" />
      <Skeleton className="w-full h-52" />
      <Skeleton className="w-lg h-16" />
      <Skeleton className="w-full h-52" />
    </div>
  )
}
export default function SellIn({ searchParams }: { searchParams: Promise<GetInvoicesParams> }) {
  return (
    <div>
      <Suspense fallback={<HomeSkeleton />}>
        <AppBreadcrumb />
        <SellInContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
