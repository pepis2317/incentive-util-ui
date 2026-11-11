import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Invoice, invoiceColumns } from "@/components/invoices/invoice-columns"
import { TableSearch } from "@/components/table-search"
import { invoiceSearch } from "./invoice-search"
import { DataTable } from "@/components/data-table"
import Link from "next/link"
import { ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getData(): Promise<Invoice[]> {
  return [
    {
      id: 1,
      transaction_id: "test-01",
      customer_name: "test type",
      undiscounted_total: 100,
      discounted_total: 100,
      created_at: 1794279685,
      updated_at: null
    },
    {
      id: 2,
      transaction_id: "test-02",
      customer_name: "test type",
      undiscounted_total: 100,
      discounted_total: 100,
      created_at: 1794279685,
      updated_at: null
    },
  ]
}
export default async function Invoices() {
  const data = await getData()
  return (
    <div>
      <AppBreadcrumb />
      <div className="flex gap-2">
        <TableSearch onSearch={invoiceSearch} />
        <Button type="submit" render={<Link href="/invoices/create" />} nativeButton={false}>
          <ScrollText />
          Create New Invoice
        </Button>
      </div>
      <DataTable columns={invoiceColumns} data={data} />
    </div>
  )
}
