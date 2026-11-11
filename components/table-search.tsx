"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TableSearch({ onSearch, defaultValue = "", }: { onSearch: (query: string) => void, defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue)

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    onSearch(value.trim())
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
      <Button type="submit">
        <SearchIcon />
      </Button>
    </form>
  )
}
