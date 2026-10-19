import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-arcade-line bg-arcade-card px-4 py-2 text-sm text-slate-100 shadow-sm transition placeholder:text-slate-400 focus-visible:border-arcade-cyan/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-arcade-cyan/40 focus-visible:shadow-neon-cyan disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
