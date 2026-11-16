import { z } from "zod"

export const editItemSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  type: z.string().nonempty(),
  brand: z.string().nonempty(),
  unit: z.string().nonempty(),
  base_price: z.number().nonnegative(),
  sell_price: z.number().nonnegative()
})

