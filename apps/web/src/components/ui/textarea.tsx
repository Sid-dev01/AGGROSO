import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 shadow-sm transition-colors duration-150 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500",
        className
      )}
      {...props}
    />
  );
}
