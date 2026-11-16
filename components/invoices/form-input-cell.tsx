import { Controller, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox"
import { useEffect, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { GetItemsResponse, Item, RecordAddForm } from "@/app/api/types"

type ItemField = "item_id" | "item_quantity" | "price_snapshot"

export function FormInputCell({ index, field, type = "text", }:
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

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function ItemComboBoxCell({ index }: { index: number }) {
  const [itemSearch, setItemSearch] = useState("")
  const [selected, setSelected] = useState<Item | null>(null)
  const debouncedSearch = useDebounce(itemSearch, 300)
  const { data: itemsResponse = { items: [] }, isLoading: itemsLoading } = useQuery<GetItemsResponse>({
    queryKey: ["items", debouncedSearch],
    queryFn: () => fetch(`/api/items?item_query=${encodeURIComponent(debouncedSearch)}`).then((r) => r.json()),
    placeholderData: keepPreviousData
  })

  const { control, setValue } = useFormContext<RecordAddForm>()

  return (
    <Controller
      control={control}
      name={`items.${index}.item_id`}
      render={({ field, fieldState }) => {
        const current =
          selected?.id === field.value
            ? selected
            : itemsResponse.items.find((i) => i.id === field.value) ?? null

        return (
          <Combobox
            items={itemsResponse.items}
            value={current}
            isItemEqualToValue={(a, b) => a.id === b.id}
            itemToStringLabel={(i) => i.name}
            filter={null}
            onValueChange={(v) => {
              setSelected(v ?? null)
              field.onChange(v?.id ?? "")
              setValue(`items.${index}.price_snapshot`, v?.sell_price ?? 0)
            }}
            onInputValueChange={(text, details) => {
              if (details.reason === "input-change") setItemSearch(text)
            }}
            disabled={itemsLoading}
          >
            <ComboboxInput
              placeholder="Select Item"
              className="w-full"
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
            />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(i) => (
                  <ComboboxItem key={i.id} value={i}>
                    {i.id} {i.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        )
      }}
    />
  )
}
