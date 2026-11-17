import { z } from "zod"

const discountType = z.enum(["percentage", "flat"], {
  message: "Select a discount type",
})

const discountValue = z
  .number({ message: "Enter a value" })
  .positive("Must be greater than 0")

export const editDiscountSchema = z.object({
  discount_record_id: z.number(),
  discount_type: discountType,
  discount_value: discountValue
})

export const addDiscountSchema = z.object({
  discount_type: discountType,
  discount_value: discountValue
})

export const editTransactionSchema = z.object({
  record_id: z.number(),
  price_snapshot: z.number().int().nonnegative(),
  item_id: z.string().trim().min(1, "Required"),
  quantity: z.number().int().positive(),
  discounts: z.array(editDiscountSchema),
  discounts_to_delete: z.array(z.number()),
  discounts_to_add: z.array(addDiscountSchema)
})

export const deleteTransactionSchema = z.object({
  id: z.coerce.number().int().positive(),
});

