import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { Item } from "./item-columns"

export function EditItemDialog({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
        </DialogHeader>
        <EditItemForm
          item={item}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function EditItemForm({ item, onSuccess }: { item: Item, onSuccess: () => void }) {
  const [name, setName] = useState(item.name)
  const [type, setType] = useState(item.type)
  const [brand, setBrand] = useState(item.brand)
  const [unit, setUnit] = useState(item.unit)
  const [sellPrice, setSellPrice] = useState(item.sell_price)


  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    // TODO: save { name, type } here using tools from tanstack
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Input
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Price</Label>
        <Input
          id="sell_price"
          type="number"
          value={sellPrice}
          onChange={(e) => setSellPrice(Number(e.target.value))}
        />
      </div>

      <Button type="submit">Save</Button>
    </form>
  )
}
