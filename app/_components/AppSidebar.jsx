"use client"

import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  MessageSquare,
  LayoutDashboard,
  Compass,
  Vault,
  Archive,
  SlidersHorizontal,
} from "lucide-react"

const items = [
  { title: "New Chat", url: "#", icon: MessageSquare, faded: true },
  { title: "Home", url: "#", icon: LayoutDashboard },
  { title: "Explore", url: "#", icon: Compass },
  { title: "Vault", url: "#", icon: Vault },
  { title: "Archive", url: "#", icon: Archive },
  { title: "Settings", url: "#", icon: SlidersHorizontal },
]

function SidebarLogo() {
  const { setOpen } = useSidebar()

  return (
    <div
      className="flex justify-center items-center h-16 cursor-pointer transition-opacity duration-300"
      onMouseEnter={() => setOpen(true)}
    >
      <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
    </div>
  )
}

function AppSidebar() {
  const { open, setOpen } = useSidebar()

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="transition-all duration-300 ease-in-out"
      onMouseLeave={() => setOpen(false)}
    >
      {/* Logo at top */}
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>

      {/* Menu items */}
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className={`flex items-center gap-2 transition-colors duration-300 ${
                      item.faded ? "opacity-60 hover:opacity-100" : ""
                    }`}
                  >
                    <item.icon size={24} />
                    {/* Fade in text smoothly */}
                    <span
                      className={`transition-opacity duration-300 ${
                        open ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
