"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: DialogProps) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-zinc-950/30"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <section
        aria-modal="true"
        className={cn(
          "relative z-10 flex max-h-[calc(100vh-32px)] w-full max-w-2xl flex-col rounded-lg border border-zinc-200 bg-white shadow-lg"
        )}
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-zinc-100 p-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="overflow-y-auto p-5">{children}</div>
        {footer ? (
          <footer className="flex flex-col-reverse gap-2 border-t border-zinc-100 p-5 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}
