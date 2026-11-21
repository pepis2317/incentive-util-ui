"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function TableSearch({ query, defaultValue = "", }: { query: string, defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    const search = value.trim()

    const params = new URLSearchParams(searchParams.toString())
    if (searchParams) {
      params.set(query, search)
    }
    else {
      params.delete(query)
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="search"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="max-w-sm"
      />
      <Button className="min-w-12 h-12" type="submit">
        <SearchIcon />
      </Button>
    </form>
  )
}
