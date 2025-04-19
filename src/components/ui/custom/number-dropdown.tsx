import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function NumberDropdown({size, placeholder, prefix}: {size: number, placeholder: string, prefix: string}) {
  const [selected, setSelected] = useState<number | null>(null)

  const numbers: number[] = Array.from({ length: size }, (_, i) => i + 1) // 1 to 10

  const handleSelect = (value: number) => {
    setSelected(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selected !== null ? `${prefix}:  ${selected}` : placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {numbers.map((num) => (
          <DropdownMenuItem key={num} onSelect={() => handleSelect(num)}>
            {num}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
