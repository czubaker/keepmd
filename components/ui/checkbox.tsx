"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDesign } from "@/components/design-context"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { designSystem } = useDesign()

  const designClasses = {
    default: "h-4 w-4 rounded-sm",
    ios: "h-5 w-5 rounded-md",
    material: "h-5 w-5 rounded-sm",
  }

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        designClasses[designSystem],
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <Check className={cn("h-4 w-4", designSystem === "material" && "h-4.5 w-4.5")} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
