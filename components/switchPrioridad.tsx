"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SwitchPrioridad() {
  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => setChecked((prev) => !prev);

  return (
    <div className="">
      <div
        className="group inline-flex items-center justify-between gap-2 w-full px-4"
        data-state={checked ? "checked" : "unchecked"}
      >
        <span
          id="switch-off-label"
          className="cursor-pointer text-right text-sm font-medium group-data-[state=checked]:text-muted-foreground/70"
          onClick={() => setChecked(false)}
        >
          Menos tiempo
        </span>
        <Switch
          id="switch-09"
          checked={checked}
          onCheckedChange={toggleSwitch}
          aria-labelledby="switch-off-label switch-on-label"
        />
        <span
          id="switch-on-label"
          className=" cursor-pointer text-left text-sm font-medium group-data-[state=unchecked]:text-muted-foreground/70"
          onClick={() => setChecked(true)}
        >
          Menos transbordos
        </span>
      </div>
    </div>
  );
}
