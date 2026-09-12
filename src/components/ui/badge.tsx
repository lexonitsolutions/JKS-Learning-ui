import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-label",
  {
    variants: {
      variant: {
        // bg-light used to resolve to the page canvas in dark mode, which made
        // the neutral badge disappear. It now sits one step above the canvas.
        neutral: "bg-bg-light text-text-body border border-border",
        primary: "bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-ink",
        success: "bg-success-bg text-success border border-success/20",
        warning: "bg-warning-bg text-warning border border-warning/20",
        error: "bg-error-bg text-error border border-error/20",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
