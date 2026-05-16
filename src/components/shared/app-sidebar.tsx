"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FileText, Users, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/server/actions/auth/sign-out";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard },
  { href: "/customers", icon: Users },
  { href: "/invoices", icon: FileText },
  { href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    
    await signOutAction();
    
  };

  return (
    <Sidebar variant="sidebar" className="border-none bg-transparent">
      <SidebarHeader className="h-24 flex items-center justify-center flex-row">
        <div className="flex items-center justify-center w-full">
          <Image src={logo} alt="Invoice Flow Logo" className="w-14 h-14 object-contain" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col items-center py-4 gap-4">
        <SidebarMenu className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <SidebarMenuItem key={item.href} className="w-full flex justify-center">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-sm",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary/30"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} strokeWidth={2.5} />
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="flex flex-col items-center pb-8">
        <SidebarMenu className="flex flex-col items-center">
          <SidebarMenuItem className="w-full flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-slate-700 hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
            >
              <LogOut className="w-5 h-5 transition-transform hover:-translate-x-0.5" strokeWidth={2.5} />
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
