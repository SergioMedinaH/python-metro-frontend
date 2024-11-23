"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { DateInput, DateSegment, TimeField } from "react-aria-components";
import { Time } from '@internationalized/date';

export default function TimeInput({time, setTime}: {time: Time, setTime: (time: Time) => void}) {
  

  return (
    <TimeField 
      className="space-y-2" 
      value={time} 
      onChange={setTime}
      hourCycle={24}
      aria-label="Seleccionar hora"
    >
        <p className="text-sm">Hora y día de salida</p>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-muted-foreground">
          <Clock size={16} strokeWidth={2} aria-hidden="true" />
        </div>
        <DateInput className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 ps-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 data-[focus-within]:outline-none">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
            />
          )}
        </DateInput>
      </div>
    </TimeField>
  );
}
