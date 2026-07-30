"use client";

import * as React from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  notify: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const tones = {
  success: "border-emerald-200 text-emerald-700",
  error: "border-red-200 text-red-700",
  info: "border-blue-200 text-blue-700",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const notify = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();

    setToasts((items) => [...items, { ...toast, id }]);

    window.setTimeout(() => {
      dismiss(id);
    }, 4500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-32px)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((toast) => {
          const Icon = icons[toast.tone];

          return (
            <div
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-lg"
              key={toast.id}
            >
              <div className="flex gap-3">
                <Icon className={cn("mt-0.5 h-4 w-4", tones[toast.tone])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-950">
                    {toast.title}
                  </p>
                  {toast.description ? (
                    <p className="mt-1 text-sm leading-5 text-zinc-500">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
                <Button
                  aria-label="Dismiss notification"
                  className="-mr-2 -mt-2"
                  onClick={() => dismiss(toast.id)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
