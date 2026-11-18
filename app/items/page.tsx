import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { DataTable } from "@/components/data-table";
import { itemColumns } from "@/components/items/item-columns";
import { TableSearch } from "@/components/table-search";
import { AddItemDialog } from "@/components/items/add-item-dialog";
import { getItems } from "../api/endpoints";
import { Suspense } from "react";
import { GetItemParams } from "../api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toast";

async function ItemsContent({ searchParams }: { searchParams: Promise<GetItemParams> }) {
  const params = await searchParams
  const data = await getItems(params)
  return (
    <div>
      <div className="space-y-2">
        <AddItemDialog />
        <TableSearch query={"item_query"} />
        <DataTable columns={itemColumns} data={data.items} rowCount={data.total} />
      </div>
      <Toaster />
    </div>
  )
}
function ItemsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-xs h-10" />
      <Skeleton className="w-lg h-16" />
      <Skeleton className="w-full h-52" />
    </div>
  )
}
export default function Items({ searchParams }: { searchParams: Promise<GetItemParams> }) {
  return (
    <div>
      <Suspense fallback={<ItemsSkeleton />}>
        <AppBreadcrumb />
        <ItemsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

