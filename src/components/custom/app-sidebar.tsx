"use client";
import { authClient } from "@/lib/auth-client";
import {
  CoinsIcon,
  CreditCardIcon,
  FolderOpenIcon,
  LogOutIcon,
  RefreshCcwIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { Spinner } from "../ui/spinner";

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
      {
        title: "Upgrade to pro",
        path: "/upgrade",
        icon: StarIcon,
      },
      {
        title: "Billing",
        path: "/billing",
        icon: CreditCardIcon,
      },
    ],
  },
];

export const AppSidebar = () => {
  const pathName = usePathname();
  const router = useRouter();

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
                        <item.icon className="size-5" />
                        <span className="">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
