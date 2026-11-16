import { editCustomerSchema } from "@/components/customers/create-edit-customer-schema"
import { addTransactionSchema } from "@/components/invoices/add-transaction-schema"
import { recordAddSchema } from "@/components/invoices/create-invoice-schema"
import { editInvoiceSchema } from "@/components/invoices/edit-invoice-schema"
import { addDiscountSchema, editDiscountSchema, editTransactionSchema } from "@/components/invoices/edit-transaction-schema"
import { editItemSchema } from "@/components/items/create-edit-item-schema"
import z from "zod"

export type GetCustomersResponse = {
  customers: Customer[]
  total: number
  page: number
}

export type GetCustomerParams = {
  customer_query: string | null,
  page: number,
  page_size: number
}

export type Customer = {
  id: string
  name: string
  type_id: number
  created_at: number
  updated_at: number | null
}

export type CustomerResponse = {
  success: string
}

export type GetItemParams = {
  item_query: string | null
  page: number,
  page_size: number
}

export type Item = {
  id: string
  name: string
  type: string
  brand: string
  unit: string
  base_price: number
  sell_price: number
  created_at: number
  updated_at: number | null
}

export type GetItemsResponse = {
  items: Item[]
  total: number
  page: number
}

export type ItemResponse = {
  success: string
}


export type GetInvoicesParams = {
  transaction_id_query: string | null
  page: number
  page_size: number
}

export type Invoice = {
  id: number,
  transaction_id: string
  customer_name: string
  undiscounted_total: number
  discounted_total: number
  created_at: number
  updated_at: number | null
}

export type GetInvoicesResponse = {
  invoices: Invoice[]
  page: number
  total: number
}

export type InvoiceResponse = {
  id: number
  customer_id: string
  customer: Customer
  transaction_id: string
  updated_at: number | null
  created_at: number
  transaction_records: TransactionRecord[]
  invoice_snapshots: InvoiceSnapshot[]
}

export type TransactionRecord = {
  id: number
  quantity: number
  created_at: number
  invoice_id: number
  item_id: string
  item: Item
  price_snapshot: number
  updated_at: number | null
  transaction_discount_snapshots: TransactionDiscountSnapshot[]
  discount_records: DiscountRecord[]
}

export type DiscountRecord = {
  id: number
  transaction_record_id: number
  type: string
  step: number
  value: number
  created_at: number
  updated_at: number | null
}

export type TransactionDiscountSnapshot = {
  transaction_record_id: number
  created_at: number
  id: number
  discount_record_snapshots: DiscountRecordSnapshot[]
}

export type DiscountRecordSnapshot = {
  step: number
  transaction_discount_snapshot_id: number
  type: string
  id: number
  value: number
  created_at: number
}

export type InvoiceSnapshot = {
  id: number,
  transaction_id: string
  invoice_id: number
  customer_id: string
  created_at: number
  updated_at: number | null
  transaction_record_snapshots: TransactionRecordSnapshot[]
}

export type TransactionRecordSnapshot = {
  id: number
  item_id: string
  item: Item
  quantity: number
  invoice_snapshot_id: number
  undiscounted_price: number
  discounted_price: number
  created_at: number
}

export type GetTransactionRecordParams = {
  id: number
  item_query: string | null
}

export type TransactionRecordsResponse = {
  invoice: InvoiceResponse
}

export type TransactionResponse = {
  success: string
}

export type AddItemRequest = z.infer<typeof editItemSchema>
export type EditItemRequest = z.infer<typeof editItemSchema>
export type AddCustomerRequest = z.infer<typeof editCustomerSchema>
export type EditCustomerRequest = z.infer<typeof editCustomerSchema>
export type EditInvoiceRequest = z.infer<typeof editInvoiceSchema>
export type EditTransactionRequest = z.infer<typeof editTransactionSchema>
export type AddDiscountRow = z.infer<typeof addDiscountSchema>
export type DiscountEditRow = z.infer<typeof editDiscountSchema>
export type RecordAddForm = z.infer<typeof recordAddSchema>
export type RecordAddItem = RecordAddForm["items"][number]
export type ItemDiscount = RecordAddItem["discounts"][number]
export type AddTransactionRequest = z.infer<typeof addTransactionSchema>
