import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";
import { customerColumns } from "@/components/customers/customer-columns";
import { DataTable } from "@/components/data-table";
import { TableSearch } from "@/components/table-search";
import { getCustomers } from "../api/endpoints";
import { Suspense } from "react";
import { GetCustomerParams } from "../api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toast";

async function CustomerContent({ searchParams }: { searchParams: Promise<GetCustomerParams> }) {
  const params = await searchParams
  const data = await getCustomers(params)
  return (
    <div>
      <div className="flex gap-2">
        <TableSearch query="customer_query" />
        <AddCustomerDialog />
      </div>
      <DataTable columns={customerColumns} data={data.customers} rowCount={data.total} />
      <Toaster />
    </div>
  )
}
function CustomersSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-xs h-10" />
      <Skeleton className="w-lg h-16" />
      <Skeleton className="w-full h-52" />
    </div>
  )
}

export default function Customers({ searchParams }: { searchParams: Promise<GetCustomerParams> }) {
  return (
    <div>
      <Suspense fallback={<CustomersSkeleton />}>
        <AppBreadcrumb />
        <CustomerContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
