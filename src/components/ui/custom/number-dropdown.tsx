import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

type Props = {
    selected: number
    setSelected: React.Dispatch<React.SetStateAction<number>>
    size: number
    placeholder: string
    width?: number
    prefix: string
}

export default function NumberDropdown({selected, setSelected, size, placeholder, width, prefix}: Props) {

  const numbers: number[] = Array.from({ length: size }, (_, i) => i + 1) // 1 to 10

  const handleSelect = (value: number) => {
    setSelected(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-fit justify-between relative">
          {!width ? <span className="invisible">{placeholder}</span> : <span className={`w-[${width}px]`}></span>}
          <span className="absolute truncate">
            {selected !== null ? `${prefix}:  ${selected}` : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
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
