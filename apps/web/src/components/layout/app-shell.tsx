"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Menu,
  PanelLeftClose,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/upload",
    label: "Upload CSV",
    icon: Upload,
  },
  {
    href: "/themes",
    label: "Theme Review",
    icon: Sparkles,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: FileText,
  },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/upload": "Upload CSV",
  "/themes": "Theme Review",
  "/reports": "Report",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const title = pageTitles[pathname] ?? "Workspace";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-zinc-950/30"
            onClick={() => setMobileOpen(false)}
            type="button"
          />
          <aside className="relative h-full w-72 max-w-[calc(100vw-32px)] border-r border-zinc-200 bg-white shadow-lg">
            <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4">
              <Brand />
              <Button
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent pathname={pathname} showBrand={false} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <Button
              aria-label="Open navigation"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Link className="hover:text-zinc-900" href="/">
                  Feedback
                </Link>
                <span>/</span>
                <span className="truncate text-zinc-900">{title}</span>
              </div>
            </div>
            <Button asChild className="hidden sm:inline-flex" size="sm">
              <Link href="/upload">
                <Upload className="h-4 w-4" />
                New upload
              </Link>
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  showBrand = true,
}: {
  pathname: string;
  showBrand?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      {showBrand ? (
        <div className="flex h-14 items-center border-b border-zinc-200 px-5">
          <Brand />
        </div>
      ) : null}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-950",
                active && "bg-zinc-100 text-zinc-950"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs font-medium text-zinc-950">Analysis pipeline</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Upload feedback, review approved themes, then generate a report.
          </p>
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link className="flex min-w-0 items-center gap-3" href="/">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-950 text-white">
        <BarChart3 className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-zinc-950">
          FeedbackOS
        </p>
        <p className="truncate text-xs text-zinc-500">Customer analysis</p>
      </div>
    </Link>
  );
}
