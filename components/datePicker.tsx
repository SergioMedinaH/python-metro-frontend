"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { es } from "date-fns/locale";

import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithPresets() {
  const [date, setDate] = React.useState<Date>(new Date())

  const handlePresetClick = (daysToAdd: number) => {
    setDate(addDays(new Date(), daysToAdd))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal px-3",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          {date ? format(date, "PPP", { locale: es }) : <span>Seleccione la fecha de salida</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <p className="text-sm text-center ">Seleccione la fecha de salida</p>
        <div className="rounded-md border mt-2">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
