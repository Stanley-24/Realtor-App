// src/components/ui/button-variants.ts
import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
       /** 🔵 Custom Blue Buttons */
        primaryBlue:
          "bg-primary-blue text-white shadow hover:bg-primary-blue/90",

        secondaryBlue:
          "bg-secondary-blue text-white shadow hover:bg-secondary-blue/90",

        lightBlue:
          "bg-light-blue text-white shadow hover:bg-light-blue/90",

        /** 🟢 CTA / Action */
        cta:
          "bg-btn-colors text-white shadow hover:bg-btn-colors/90",

        /** 🌸 Pink Variant */
        pinky:
          "bg-pinky text-white shadow hover:bg-pinky/90",

        /** 🌤 Soft / Subtle */
        soft:
          "bg-lighty text-slate-900 shadow hover:bg-lighty/80",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)