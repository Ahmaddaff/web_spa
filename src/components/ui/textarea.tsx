import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-arcade-line bg-arcade-card px-4 py-3 text-sm text-slate-100 shadow-sm transition placeholder:text-slate-400 focus-visible:border-arcade-cyan/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-arcade-cyan/40 focus-visible:shadow-neon-cyan disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
