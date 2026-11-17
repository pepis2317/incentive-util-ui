import { api } from "./client";
import { AddCustomerRequest, AddItemRequest, AddTransactionRequest, CustomerResponse, EditCustomerRequest, EditInvoiceRequest, EditItemRequest, EditTransactionRequest, GetCustomerParams, GetCustomersResponse, GetHomeResponse, GetInvoicesParams, GetInvoicesResponse, GetItemParams, GetItemsResponse, GetTransactionRecordParams, InvoiceResponse, ItemResponse, RecordAddForm, TransactionRecordsResponse, TransactionResponse } from "./types";

export const getCustomers = (params: GetCustomerParams) =>
  api.get<GetCustomersResponse>("/customers", { params })
export const editCustomer = (body: EditCustomerRequest) =>
  api.put<CustomerResponse>("/customers", body)
export const addCustomer = (body: AddCustomerRequest) =>
  api.post<CustomerResponse>("/customers", body)

export const getItems = (params: GetItemParams) =>
  api.get<GetItemsResponse>("/items", { params })
export const addItem = (body: AddItemRequest) =>
  api.post<ItemResponse>("/items", body)
export const editItem = (body: EditItemRequest) =>
  api.put<ItemResponse>("/items", body)

export const getInvoices = (params: GetInvoicesParams) =>
  api.get<GetInvoicesResponse>("/invoices", { params })
export const editTransaction = (body: EditTransactionRequest) =>
  api.put<TransactionResponse>("/transaction-records/edit-transaction-record", body)
export const addTransaction = (body: AddTransactionRequest) =>
  api.put<TransactionResponse>("/invoices/add-transaction-record-item", body)
export const editInvoice = (body: EditInvoiceRequest) =>
  api.put<InvoiceResponse>("/invoices", body)
export const addInvoice = (body: RecordAddForm) =>
  api.post<InvoiceResponse>("/invoices", body)
export const deleteTransaction = (id: number) =>
  api.delete<TransactionResponse>("/transaction-records", { params: { id } })
export const deleteInvoice = (id: number) =>
  api.delete<InvoiceResponse>("/invoices", { params: { id } })
export const getTransactionRecords = (params: GetTransactionRecordParams) =>
  api.get<TransactionRecordsResponse>("/invoices/detail", { params })

export const getHome = () =>
  api.get<GetHomeResponse>("/reports")
