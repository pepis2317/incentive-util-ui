import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";
import { customerColumns, Customer } from "@/components/customers/customer-columns";
import { DataTable } from "@/components/data-table";
import { TableSearch } from "@/components/table-search";
import { customerSearch } from "./customer-search";

async function getData(): Promise<Customer[]> {
  return [
    {
      id: "C01",
      name: "test customer",
      type: "test type",
      created_at: 1794279685,
      updated_at: null
    },
    {
      id: "C02",
      name: "test customer 2",
      type: "test type",
      created_at: 1794279726,
      updated_at: 1794279685
    },
  ]
}
export default async function Customers() {
  const data = await getData()
  return (
    <div>
      <AppBreadcrumb />
      <div className="flex gap-2">
        <TableSearch onSearch={customerSearch} />
        <AddCustomerDialog />
      </div>
      <DataTable columns={customerColumns} data={data} />
    </div>
  )
}
