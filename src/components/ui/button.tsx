import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0B14] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          /* PRIMARY CTA — solid vivid magenta + the loudest glow on the page,
             so "Play Game" is unmistakably the focal point */
          "bg-arcade-magenta text-white shadow-neon-magenta hover:bg-[#FF2A93] hover:shadow-[0_0_0_1px_rgba(255,0,127,0.6),0_0_26px_rgba(255,0,127,0.6),0_0_60px_-6px_rgba(255,0,127,0.55)] active:bg-[#E0006F]",
        outline:
          /* SECONDARY CTA — true ghost button: transparent fill, thin neon hairline */
          "border border-arcade-purple/60 bg-transparent text-arcade-cyan shadow-none transition-all hover:border-arcade-cyan hover:bg-arcade-purple/5 hover:text-white hover:shadow-neon-cyan",
        ghost:
          "transition-colors hover:bg-arcade-purple/10 hover:text-arcade-cyan hover:shadow-neon-purple",
        link: "text-arcade-cyan underline-offset-4 hover:underline hover:[text-shadow:0_0_10px_rgba(0,229,255,0.6)]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
