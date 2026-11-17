"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function InvoiceDateFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = searchParams.get("from_date")
    const to = searchParams.get("to_date")
    if (!from) return undefined
    return { from: parseISO(from), to: to ? parseISO(to) : undefined }
  })

  const applyRange = (next: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (next?.from) {
      params.set("from_date", format(next.from, "yyyy-MM-dd"))
    } else {
      params.delete("from_date")
    }

    if (next?.to) {
      params.set("to_date", format(next.to, "yyyy-MM-dd"))
    } else {
      params.delete("to_date")
    }

    params.set("page", "1") // filter changed, go back to the first page

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  const handleClear = () => {
    setRange(undefined)
    applyRange(undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button className="w-fit" variant="outline" />}>
        <CalendarIcon />
        {range?.from ? (
          range.to ? (
            <>
              {format(range.from, "LLL d, y")} - {format(range.to, "LLL d, y")}
            </>
          ) : (
            format(range.from, "LLL d, y")
          )
        ) : (
          "Pick a date range"
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Card>
          <CardContent>
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              defaultMonth={range?.from}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button onClick={() => applyRange(range)} disabled={!range?.from}>
              Apply
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
