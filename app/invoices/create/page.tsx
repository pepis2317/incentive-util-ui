import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { CreateInvoiceForm } from "@/components/invoices/create-invoice-form";
import { invoiceFormSubmit } from "./invoice-form-submit";
import { Suspense } from "react";

export default async function CreateInvoice() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <div>
        <AppBreadcrumb />
        <CreateInvoiceForm onSuccess={invoiceFormSubmit} />
      </div>
    </Suspense>
  )
}
