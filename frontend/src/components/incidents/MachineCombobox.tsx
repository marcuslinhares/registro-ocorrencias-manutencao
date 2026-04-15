'use client';

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

const machines = [
  { value: "Torno CNC", label: "Torno CNC" },
  { value: "Fresadora", label: "Fresadora" },
  { value: "Prensa", label: "Prensa" },
  { value: "Corte a Laser", label: "Corte a Laser" },
  { value: "Dobradora", label: "Dobradora" },
]

interface MachineComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function MachineCombobox({ value, onChange }: MachineComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        />
      }>
        {value
          ? machines.find((machine) => machine.value === value)?.label
          : "Selecione a máquina..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[--anchor-width] p-0">
        <Command>
          <CommandInput placeholder="Buscar máquina..." />
          <CommandList>
            <CommandEmpty>Nenhuma máquina encontrada.</CommandEmpty>
            <CommandGroup>
              {machines.map((machine) => (
                <CommandItem
                  key={machine.value}
                  value={machine.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  data-checked={value === machine.value}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === machine.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {machine.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
