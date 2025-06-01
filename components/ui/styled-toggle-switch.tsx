"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

interface StyledToggleSwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const StyledToggleSwitch = React.forwardRef<
  HTMLButtonElement,
  StyledToggleSwitchProps
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-gray-700",
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="sr-only">Use toggle</span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
})

StyledToggleSwitch.displayName = "StyledToggleSwitch"

export { StyledToggleSwitch } 