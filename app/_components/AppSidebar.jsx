"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  UserPlus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { amatic } from "@/lib/fonts";

const items = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: Search,
  },
  {
    title: "Vault",
    path: "/vault",
    icon: Calendar,
  },
  {
    title: "Archive",
    path: "/archive",
    icon: Inbox,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const path = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="w-full flex justify-center py-4">
          <img
            src="query.jpeg"
            alt="query"
            className={`transition-all rounded-2xl duration-300 ease-in-out ${
              isCollapsed ? "w-8 h-8" : "w-12 h-10"
            }`}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${
                      path?.includes(item.path) && item.path !== "/"
                        ? "font-bold bg-accent"
                        : path === "/" && item.path === "/"
                        ? "font-bold bg-accent"
                        : ""
                    }`}
                  >
                    <a
                      className={`flex items-center gap-2 ${amatic.variable}`}
                      href={item.path}
                    >
                      <item.icon size={20} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Button
              className={`rounded-full mx-2 my-3 font-bold transition-all duration-300 ${
                isCollapsed
                  ? "p-2 mx-0.5 w-8 h-8 flex items-center justify-center text-sm"
                  : "py-4 px-6"
              } ${amatic.variable}`}
              aria-label="Sign Up"
              title="Sign Up"
            >
              {!isCollapsed ? "Sign Up" : <UserPlus size={16} />}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-gray-500 text-center">
          {!isCollapsed ? "Version 1.0.0" : "v1.0"}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
