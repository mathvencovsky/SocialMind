import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-muted hover:text-foreground hover:border-primary/30",
        secondary:
          "bg-gradient-amber text-white hover:opacity-90 shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-white hover:shadow-glow transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 font-semibold shadow-medium",
        cyan: "bg-accent-cyan text-white hover:opacity-90 shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        coral: "bg-accent-coral text-white hover:opacity-90 shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        premium: "bg-gradient-to-r from-primary via-accent-cyan to-accent-amber text-white hover:shadow-glow transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 font-semibold",
        success: "bg-accent-cyan text-white hover:opacity-90 shadow-soft hover:shadow-medium hover:-translate-y-0.5",
        branded: "bg-primary text-white hover:bg-primary-dark shadow-soft hover:shadow-medium hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
