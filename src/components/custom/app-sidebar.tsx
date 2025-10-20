"use client";
import { useHasActiveSubscription } from "@/hooks/use-subscriptions";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  CoinsIcon,
  ExternalLinkIcon,
  FolderOpenIcon,
  RefreshCcwIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { NavUser } from "./nav-user";

const menuItems = [
  {
    title: "Main",
    items: [
      {
        title: "Workflows",
        path: "/workflows",
        icon: FolderOpenIcon,
      },
      {
        title: "Executions",
        path: "/executions",
        icon: RefreshCcwIcon,
      },
      {
        title: "Credentials",
        path: "/credentials",
        icon: CoinsIcon,
      },
    ],
  },
];

export const AppSidebar = () => {
  const pathName = usePathname();
  const { hasActiveSubscription } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenuButton asChild className="h-10 gap-x-4 px-4">
          <Link href="/" prefetch>
            <Image src="/logo.svg" height={24} width={24} alt="logo" />
            <h2 className="font-semibold text-2xl">Edgebase</h2>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={pathName === item.path}
                      asChild
                      className="h-10 gap-x-4 gap-y-10 px-4"
                    >
                      <Link href={item.path} prefetch>
                        <item.icon
                          className={cn(pathName === item.path ? "text-primary" : "")}
                        />
                        <span
                          className={cn(
                            "font-medium",
                            pathName === item.path
                              ? "text-primary-foreground"
                              : "text-primary-foreground/60",
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarSeparator className="w-fit" />
        <SidebarGroup>
          <SidebarGroupLabel>Billing</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Billing Portal"
                className="h-10 cursor-pointer hover:bg-transparent gap-x-4 gap-y-10 px-4 underline underline-offset-4"
                onClick={() => authClient.customer.portal()}
              >
                <ExternalLinkIcon />
                <span className="font-medium text-primary-foreground/60">
                  Billing Portal
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-y-3 py-5">
        {!hasActiveSubscription && (
          <SidebarMenuButton
            variant="outline"
            tooltip="Upgrade to Pro"
            className="h-12 cursor-pointer text-pretty text-primary bg-primary/15 hover:bg-primary/25 active:bg-primary/25 gap-x-4 px-4 group"
            onClick={() => authClient.checkout({ slug: "Edgebase-Pro" })}
          >
            <StarIcon className="size-5 group-hover:text-primary" />
            <span className="text-lg font-serif font-semibold group-hover:text-primary">
              Upgrade to Pro
            </span>
          </SidebarMenuButton>
        )}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
