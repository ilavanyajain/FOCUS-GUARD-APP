"use client"
import { cn } from "@/lib/utils"

interface CustomToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

export function CustomToggle({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  size = "md",
}: CustomToggleProps) {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked)
    }
  }

  const sizeClasses = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-13",
  }

  const thumbSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const translateClasses = {
    sm: checked ? "translate-x-4" : "translate-x-0",
    md: checked ? "translate-x-5" : "translate-x-0",
    lg: checked ? "translate-x-6" : "translate-x-0",
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        checked ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700",
        className,
      )}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={cn(
          "pointer-events-none inline-block rounded-full shadow transform ring-0 transition duration-200 ease-in-out",
          thumbSizeClasses[size],
          translateClasses[size],
          checked ? "bg-white dark:bg-gray-900" : "bg-white dark:bg-gray-300",
        )}
      />
    </button>
  )
}
