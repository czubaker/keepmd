"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
import { useDesign } from "@/components/design-context"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { designSystem } = useDesign()

  const designClasses = {
    default: {
      root: "h-6 w-11",
      thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
    },
    ios: {
      root: "h-6 w-11",
      thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
    },
    material: {
      root: "h-8 w-14",
      thumb: "h-6 w-6 data-[state=checked]:translate-x-6",
    },
  }

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        designClasses[designSystem].root,
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
          designClasses[designSystem].thumb,
        )}
      />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
