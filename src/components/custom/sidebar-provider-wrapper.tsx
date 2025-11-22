"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export const SidebarProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isEditor = pathname.includes("/workflows/");
  console.log({ isEditor });
  return (
    <SidebarProvider open={!isEditor}>
      <AppSidebar />
      <SidebarInset className="bg-accent/60">{children}</SidebarInset>
    </SidebarProvider>
  );
};
