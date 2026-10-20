import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        default:
          "border-arcade-purple/40 bg-arcade-purple/15 text-violet-200 shadow-[0_0_14px_-6px_rgba(168,85,247,0.85)] hover:border-arcade-purple/80 hover:shadow-[0_0_18px_-4px_rgba(168,85,247,1)]",
        secondary:
          "border-arcade-cyan/40 bg-arcade-cyan/15 text-cyan-200 shadow-[0_0_14px_-6px_rgba(0,229,255,0.85)] hover:border-arcade-cyan/80 hover:shadow-[0_0_18px_-4px_rgba(0,229,255,1)]",
        outline:
          "border-arcade-line text-slate-300 hover:border-arcade-cyan/50 hover:text-arcade-cyan hover:shadow-[0_0_16px_-5px_rgba(0,229,255,0.9)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
