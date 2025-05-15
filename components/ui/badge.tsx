"use client"

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useDesign } from "@/components/design-context"

const badgeVariants = cva(
  "inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      design: {
        default: "rounded-full px-2.5 py-0.5 text-xs",
        ios: "rounded-full px-2.5 py-0.5 text-xs",
        material: "rounded-full px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      design: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const { designSystem } = useDesign()

  return <div className={cn(badgeVariants({ variant, design: designSystem }), className)} {...props} />
}

export { Badge, badgeVariants }
