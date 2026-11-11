import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { RecordAddForm } from "./create-invoice-columns"

type ItemField = "item_id" | "item_quantity" | "price_snapshot"

export function ItemInputCell({ index, field, type = "text", }:
  {
    index: number
    field: ItemField
    type?: "text" | "number"
  }) {
  const { register, formState: { errors } } = useFormContext<RecordAddForm>()

  const error = errors.items?.[index]?.[field]

  return (
    <Input type={type} aria-invalid={!!error}
      {...register(`items.${index}.${field}`, {
        valueAsNumber: type === "number",
      })}
    />
  )
}
