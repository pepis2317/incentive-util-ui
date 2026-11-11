import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { DataTable } from "@/components/data-table";
import { itemColumns, Item } from "@/components/items/item-columns";
import { TableSearch } from "@/components/table-search";
import { itemSearch } from "./item-search";
import { AddItemDialog } from "@/components/items/add-item-dialog";

async function getData(): Promise<Item[]> {
  return [
    {
      id: "T01",
      name: "test item",
      unit: "PCS",
      type: "test type",
      brand: "test brand",
      sell_price: 200,
      base_price: 100,
      created_at: 1794279685,
      updated_at: null
    },
    {
      id: "T02",
      name: "test item",
      unit: "PCS",
      type: "test type",
      brand: "test brand",
      sell_price: 200,
      base_price: 100,
      created_at: 1794279685,
      updated_at: null
    },
  ]
}

export default async function Items() {
  const data = await getData()
  return (
    <div>
      <AppBreadcrumb />
      <div className="flex gap-2">
        <TableSearch onSearch={itemSearch} />
        <AddItemDialog />
      </div>
      <DataTable columns={itemColumns} data={data} />
    </div>
  )
}

