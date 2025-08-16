"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { Calendar, Home, Inbox, Search, Settings, UserPlus } from "lucide-react";
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
    <Sidebar
      variant="floating"
      collapsible="icon"
      className={`rounded-lg transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-56"}
        sm:${isCollapsed ? "w-24" : "w-64"}`}
      style={{ overflow: "hidden" }}
    >
      <SidebarHeader>
        {/* Centered logo */}
        <div className="w-full flex justify-center py-4">
          <img
            src="query.jpeg"
            alt="query"
            className={`transition-all rounded-2xl duration-300 ease-in-out
              ${isCollapsed ? "w-8 h-8" : "w-12 h-10"}
              sm:${isCollapsed ? "w-10 h-8" : "w-14 h-12"}
            `}
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
                    className={`${path?.includes(item.path) ? "font-bold" : ""}`}
                  >
                    <a className="flex items-center gap-2" href={item.path}>
                      <item.icon size={20} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            <Button
              className={`rounded-full mx-2 my-3 font-bold ${
                isCollapsed
                  ? "p-2 mx-0.5 w-8 h-8 flex items-center justify-center text-sm"
                  : "py-4 px-6"
              }`}
              aria-label="Sign Up"
              title="Sign Up"
            >
              {!isCollapsed ? (
                "Sign Up"
              ) : (
                <UserPlus size={16} />
              )}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-gray-500">Version 1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}