import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const switchId = id || React.useId()
    
    return (
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div className="space-y-0.5 flex-1">
            {label && (
              <label htmlFor={switchId} className="text-base font-medium cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-muted-foreground text-pretty">
                {description}
              </p>
            )}
          </div>
        )}
        <label
          htmlFor={switchId}
          className={cn(
            "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            props.checked ? "bg-primary" : "bg-input",
            props.disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="sr-only"
            {...props}
          />
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              props.checked ? "translate-x-6" : "translate-x-1"
            )}
          />
        </label>
      </div>
    )
  }
)
ToggleSwitch.displayName = "ToggleSwitch"

export { ToggleSwitch }
