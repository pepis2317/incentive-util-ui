import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "../ui/button"
import { Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { RecordAddForm } from "@/app/api/types"

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "flat", label: "Fixed amount" },
]

export function DiscountInputCell({ index }: { index: number }) {
  const {
    control,
    register,
  } = useFormContext<RecordAddForm>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${index}.discounts`
  })

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
                variant="outline"
                size={"icon-sm"}
                onClick={() => remove(j)}
                aria-label="Remove discount"
              >
                <X />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex-1 space-y-2">
              <Label>Discount Type</Label>
              <Controller
                control={control}
                name={`items.${index}.discounts.${j}.discount_type`}
                render={({ field: f, fieldState }) => (
                  <>
                    <Select
                      value={f.value != null ? String(f.value) : ""}
                      onValueChange={(v) => f.onChange(v)}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a type">
                          {DISCOUNT_TYPES.find((t) => t.value === f.value)?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {DISCOUNT_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`$discounts.${index}.discount_value`}>Discount Value</Label>
              <Input
                id={`discounts.${index}.discount_value`}
                type="number"
                step="any"
                {...register(`items.${index}.discounts.${j}.discount_value`, { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            discount_type: "percentage",
            discount_value: 0,
            discount_step: fields.length + 1
          })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Add discount
      </Button>
    </div>
  )
}
