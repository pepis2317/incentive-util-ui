import { z } from "zod"

export const editCustomerSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  type_id: z.number()
})
