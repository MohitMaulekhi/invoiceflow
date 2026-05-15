"use client";

import { format } from "date-fns";
import { Bell, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export function AppShell({ children, userInitials }: { children: React.ReactNode, userInitials?: string }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login";
  const currentDateLabel = format(new Date(), "EEE, dd MMM");

  if (isAuthRoute) {
    return (
      <main className="flex-1 w-full min-h-screen bg-slate-50">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "5rem" } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset className="bg-slate-50">
        <header className="sticky top-0 z-20 flex h-20 shrink-0 items-center justify-between gap-3 bg-slate-50 px-4 md:px-8">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <span className="font-semibold text-lg text-slate-900 md:hidden">Invoice Flow</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{currentDateLabel}</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-white/10">
              {userInitials || "U"}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
