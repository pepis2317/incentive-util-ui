import { useFieldArray, useFormContext } from "react-hook-form"
import { RecordAddForm } from "./create-invoice-columns"
import { Button } from "../ui/button"
import { Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card"

const emptyDiscount = {
  discount_type: "",
  discount_value: 0
}

export function DiscountInputCell({ index }: { index: number }) {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext<RecordAddForm>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${index}.discounts`
  })

  const discountErrors = errors.items?.[index]?.discounts

  return (
    <div className="space-y-2">
      {fields.map((field, j) => (
        <Card key={field.id} size="sm" >
          <CardHeader>
            <CardTitle>
              <span>
                Step {j + 1}
              </span>
            </CardTitle>
            <CardAction>
              <Button
                size="icon-xs"
                variant="outline"
                onClick={() => remove(j)}
                aria-label="Remove discount"
              >
                <X />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Type"
              aria-invalid={!!discountErrors?.[j]?.discount_type}
              {...register(`items.${index}.discounts.${j}.discount_type`)}
            />
            <Input
              type="number"
              placeholder="Value"
              aria-invalid={!!discountErrors?.[j]?.discount_value}
              {...register(`items.${index}.discounts.${j}.discount_value`, {
                valueAsNumber: true,
              })}
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"

        size="sm"
        onClick={() => append(emptyDiscount)}
      >
        <Plus /> Add discount
      </Button>
    </div>
  )
}
