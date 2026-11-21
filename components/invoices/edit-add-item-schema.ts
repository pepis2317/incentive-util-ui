import { z } from "zod"

const itemDiscountSchema = z.object({
  id: z.number(),
  type: z.string().min(1),
  value: z.number().positive(),
  step: z.number().int().min(1),
})

export const editAddItemSchema = z.object({
  item_name: z.string().nonempty(),
  item_id: z.string().nonempty(),
  quantity: z.number().int().positive(),
  price_snapshot: z.number().int().nonnegative(),
  discounts: z.array(itemDiscountSchema),
  discount_ids_to_delete: z.array((z.number())),
  discounts_to_add: z.array(itemDiscountSchema)
})
