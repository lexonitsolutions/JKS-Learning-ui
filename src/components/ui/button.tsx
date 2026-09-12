import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // Solid fills use the *fill* tokens, which stay dark enough in both
        // themes for the white label to keep its AA contrast.
        primary:
          "bg-primary-fill text-white hover:bg-primary-fill-hover active:brightness-95",
        // The outline variant used to inherit --color-primary-dark, which is
        // near-black in dark mode — the button vanished. contrast-ink flips
        // with the theme instead.
        secondary:
          "border border-contrast-ink text-contrast-ink bg-transparent hover:bg-contrast-ink hover:text-background active:brightness-95",
        tertiary: "text-primary-ink hover:underline underline-offset-4 px-0",
        destructive:
          "bg-error-fill text-white hover:bg-error-fill-hover active:brightness-95",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
