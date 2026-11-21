import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { Suspense } from "react";
import { getHome, getInvoices } from "./api/endpoints";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GetInvoicesParams } from "./api/types";
import { DataTable } from "@/components/data-table";
import { Toaster } from "@/components/ui/toast";
import { invoiceColumns } from "@/components/invoices/invoice-columns";
import { TableSearch } from "@/components/table-search";
import { InvoiceDateFilter } from "@/components/invoices/filter-invoices-popover";
import { Skeleton } from "@/components/ui/skeleton";

async function HomeContent({ searchParams }: { searchParams: Promise<GetInvoicesParams> }) {
  const summaryData = await getHome()
  const monthName = new Date().toLocaleString("default", { month: "long" });

  const params = await searchParams
  const data = await getInvoices({ ...params, type: "sell_out" })
  const large_stats = [
    { label: `Total sell in amount in ${monthName}`, value: `Rp.${summaryData.total_sell_in_amount.toLocaleString()}` },
    { label: `Total sell out amount in ${monthName}`, value: `Rp.${summaryData.total_sell_out_amount.toLocaleString()}` },
    { label: `Profit`, value: `Rp.${(summaryData.total_sell_out_amount - summaryData.total_sell_in_amount).toLocaleString()}` },
  ];
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3 mb-5">
        {large_stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {stat.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="space-y-2">
        <InvoiceDateFilter />
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
export default function Home({ searchParams }: { searchParams: Promise<GetInvoicesParams> }) {
  return (
    <div>
      <Suspense fallback={<HomeSkeleton />}>
        <AppBreadcrumb />
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
