"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface BuscadorProps {
  paradas: { value: string; label: string, lat: number, lng: number, linea: string }[]
  texto: string
  onSelect: (value: string) => void 
  selectedValue: string
}

export function Buscador({ 
    paradas, 
    texto, 
    onSelect,
    selectedValue,
}: BuscadorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    setValue(selectedValue)
  }, [selectedValue])

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue)
    setOpen(false)
    onSelect(newValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          
          {value
            ? <div className="flex gap-2">
                <div  className={cn(
                          'w-5 h-5 font-bold rounded-sm flex text-center items-center justify-center text-white',
                          paradas.find((parada) => parada.value === value)?.linea === 'A' && 'bg-lineaA',
                          paradas.find((parada) => parada.value === value)?.linea === 'B' && 'bg-lineaB',
                          paradas.find((parada) => parada.value === value)?.linea === 'C' && 'bg-lineaC',
                          paradas.find((parada) => parada.value === value)?.linea === 'D' && 'bg-lineaD',
                          paradas.find((parada) => parada.value === value)?.linea === 'E' && 'bg-lineaE',
                          )}>{paradas.find((parada) => parada.value === value)?.linea}</div>
                {paradas.find((parada) => parada.value === value)?.label}
            </div>
            
            : texto}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={texto} />
          <CommandList>
            <CommandEmpty>No se encuentra la parada.</CommandEmpty>
            <CommandGroup>
              {paradas.filter(parada => parada.value !== value).map((parada) => (
                <CommandItem
                  key={parada.value}
                  value={parada.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === parada.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div  className={cn(
                          'w-5 h-5 font-bold rounded-sm flex text-center items-center justify-center text-white',
                          parada.linea === 'A' && 'bg-lineaA',
                          parada.linea === 'B' && 'bg-lineaB',
                          parada.linea === 'C' && 'bg-lineaC',
                          parada.linea === 'D' && 'bg-lineaD',
                          parada.linea === 'E' && 'bg-lineaE',
                          )}>{parada.linea}</div>
                  {parada.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}