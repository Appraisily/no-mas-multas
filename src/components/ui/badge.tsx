import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white hover:bg-primary/80 dark:bg-primary dark:text-white dark:hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-white hover:bg-secondary/80 dark:bg-secondary dark:text-white dark:hover:bg-secondary/80",
        accent:
          "border-transparent bg-accent text-white hover:bg-accent/80 dark:bg-accent dark:text-white dark:hover:bg-accent/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-slate-950 dark:text-slate-50",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500",
        warning:
          "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500",
        info:
          "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500",
        gray:
          "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 