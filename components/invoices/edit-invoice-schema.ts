import { z } from "zod"

export const editInvoiceSchema = z.object({
  id: z.number(),
  customer_id: z.string().min(1, "Select a customer"),
  transaction_id: z.string().min(1, "Required"),
})
