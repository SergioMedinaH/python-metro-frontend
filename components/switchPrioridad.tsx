"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SwitchPrioridad({prioridadTransbordos, setPrioridadTransbordos}: {prioridadTransbordos: boolean, setPrioridadTransbordos: (prioridadTransbordos: boolean) => void}) {
  

  const toggleSwitch = () => setPrioridadTransbordos(!prioridadTransbordos);

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="group inline-flex items-center gap-2 w-full px-4"
        data-state={prioridadTransbordos ? "checked" : "unchecked"}
      >
        {/*
          <span
          id="switch-off-label"
          className="cursor-pointer text-right text-sm font-medium group-data-[state=checked]:text-muted-foreground/70"
          onClick={() => setPrioridadTransbordos(false)}
        >
          Menos tiempo
        </span>
         */}
        
        <Switch
          id="switch-09"
          checked={prioridadTransbordos}
          onCheckedChange={toggleSwitch}
          aria-labelledby="switch-off-label switch-on-label"
        />
        <span
          id="switch-on-label"
          className=" cursor-pointer text-left text-sm font-medium group-data-[state=unchecked]:text-muted-foreground/70"
          onClick={() => setPrioridadTransbordos(true)}
        >
          Menos transbordos
        </span>
      </div>
    </div>
  );
}
