import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "border-transparent bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30",
        outline: "text-slate-950 dark:text-slate-50",
        success:
          "border-transparent bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30",
        warning:
          "border-transparent bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
); 