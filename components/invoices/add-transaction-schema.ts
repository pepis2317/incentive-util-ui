import z from "zod";

const discountType = z.enum(["percentage", "flat"], {
  message: "Select a discount type",
})

const discountValue = z
  .number({ message: "Enter a value" })
  .positive("Must be greater than 0")

export const addTransactionDiscount = z.object({
  discount_type: discountType,
  discount_value: discountValue,
  discount_step: z.number().int().positive()
})

export const addTransactionSchema = z.object({
  invoice_id: z.number(),
  item_id: z.string().trim().min(1, "Required"),
  price_snapshot: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  discounts: z.array(addTransactionDiscount)
})

export const createTransactionSchema = z.object({
  invoice_id: z.number(),
  item_id: z.string().trim().min(1, "Required"),
  price_snapshot: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  discounts: z.array(addTransactionDiscount)
})
