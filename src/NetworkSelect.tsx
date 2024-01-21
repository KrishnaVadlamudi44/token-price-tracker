"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "./utils"
import { Popover, PopoverContent, PopoverTrigger } from "./components/popover"
import { Button } from "./components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./components/command"

export function NetworkSelect({
  networks,
  selectedValue = "",
  selectNetwork,
}: {
  networks: { value: string; label: string }[]
  selectedValue?: string
  selectNetwork: (network: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedValue
            ? networks.find((network) => network.value === selectedValue)?.label
            : "Select network..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search network..." className="h-9" />
          <CommandEmpty>No network found.</CommandEmpty>
          <CommandGroup>
            {networks.map((network) => (
              <CommandItem
                key={network.value}
                value={network.value}
                onSelect={(currentValue) => {
                  selectNetwork(
                    currentValue === selectedValue ? "" : currentValue
                  )
                  setOpen(false)
                }}
              >
                {network.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedValue === network.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
