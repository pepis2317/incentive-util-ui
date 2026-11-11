import { z } from "zod"

export const itemDiscountSchema = z.object({
  discount_type: z.string().min(1),
  discount_value: z.number(),
})

export const recordAddSchema = z.object({
  customer_id: z.string().min(1, "Select a customer"),
  transaction_id: z.string().min(1, "Required"),
  items: z
    .array(
      z.object({
        item_id: z.string().trim().min(1, "Required"),
        item_quantity: z.number().int().positive(),
        price_snapshot: z.number().int().nonnegative(),
        discounts: z.array(itemDiscountSchema),
      })
    )
    .min(1, "Add at least one item")
    .superRefine((items, ctx) => {
      const seen = new Map<string, number>()

      items.forEach((item, index) => {
        const id = item.item_id
        if (!id) return

        const firstIndex = seen.get(id)
        if (firstIndex === undefined) {
          seen.set(id, index)
          return
        }

        // flag both the duplicate and the first occurrence
        for (const i of [firstIndex, index]) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate item ID",
            path: [i, "item_id"],
          })
        }
      })
    }),
})
