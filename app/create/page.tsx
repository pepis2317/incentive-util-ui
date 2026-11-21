import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { CreateInvoiceForm } from "@/components/invoices/create-invoice-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toast";
import { Suspense } from "react";

function CreateInvoiceSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-xs h-10" />
      <Skeleton className="w-lg h-10" />
      <Skeleton className="w-lg h-10" />
      <Skeleton className="w-full h-32" />
    </div>
  )
}
export default async function CreateInvoice() {
  return (
    <div>
      <Suspense fallback={<CreateInvoiceSkeleton />}>
        <div>
          <AppBreadcrumb />
          <CreateInvoiceForm type={"sell_out"} />
        </div>
      </Suspense>
      <Toaster />
    </div>
  )
}
