"use client"
import React from "react";
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

// Using Heroicons - install with: npm install @heroicons/react
import {
  ChatBubbleLeftIcon,
  HomeIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const items = [
  { 
    title: "New Chat", 
    url: "#", 
    icon: ChatBubbleLeftIcon, 
    faded: true
  },
  { 
    title: "Home", 
    url: "#", 
    icon: HomeIcon
  },
  { 
    title: "Explore", 
    url: "#", 
    icon: GlobeAltIcon
  },
  { 
    title: "Vault", 
    url: "#", 
    icon: LockClosedIcon
  },
  { 
    title: "Archive", 
    url: "#", 
    icon: ArchiveBoxIcon
  },
  { 
    title: "Settings", 
    url: "#", 
    icon: Cog6ToothIcon
  },
]

function SidebarLogo() {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className="flex items-center justify-center h-16 cursor-pointer group relative"
      onMouseEnter={() => setOpen(true)}
      style={{ width: open ? 'auto' : '144px' }} // 144px = 36 * 4 (w-36 equivalent)
    >
      {/* Logo positioned to the right when closed */}
      <div 
        className="relative flex-shrink-0 transition-all duration-500 ease-out"
        style={{
          transform: open ? 'translateX(0px)' : 'translateX(32px)'
        }}
      >
        {/* Floating orb effects */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-spin opacity-10 scale-110" 
             style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-md group-hover:blur-lg group-hover:opacity-30 transition-all duration-500"></div>
        
        <div className="relative bg-white dark:bg-gray-900 rounded-full p-1 shadow-lg ring-1 ring-gray-200/50 dark:ring-gray-700/50">
          <img 
            src="/query.jpeg" 
            alt="Query Logo" 
            className="w-8 h-8 rounded-full object-cover group-hover:scale-110 transition-transform duration-300" 
          />
        </div>
        
        {/* Subtle pulse indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ring-2 ring-white dark:ring-gray-900"></div>
      </div>
      
      {/* Brand text with staggered animation */}
      <div 
        className="ml-4 overflow-hidden transition-all duration-500 ease-out"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateX(0px)' : 'translateX(-16px)',
          width: open ? 'auto' : '0px'
        }}
      >
        <h1 className="font-bold text-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
          Query
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 whitespace-nowrap">
          AI Assistant
        </p>
      </div>
    </div>
  )
}

function AppSidebar() {
  const { open, setOpen } = useSidebar()
  
  return (
    <div className="relative">
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="transition-all duration-500 ease-out border-r border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm"
        style={{ 
          width: open ? '280px' : '144px', // Explicit width control
          minWidth: open ? '280px' : '144px'
        }}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Header with Logo */}
        <SidebarHeader className="border-b border-gray-100/80 dark:border-gray-800/80 bg-gradient-to-r from-gray-50/50 to-white/30 dark:from-gray-900/50 dark:to-gray-800/30">
          <SidebarLogo />
        </SidebarHeader>
        
        {/* Menu Content */}
        <SidebarContent className="py-6 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-900/30">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`flex items-center gap-0 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden
                        hover:bg-white/80 dark:hover:bg-gray-800/60 hover:shadow-sm hover:scale-[0.98]
                        ${item.faded ? "opacity-60 hover:opacity-100" : ""}
                      `}
                      style={{ 
                        paddingLeft: open ? '12px' : '8px',
                        paddingRight: '12px'
                      }}
                    >
                      {/* Icon Container */}
                      <div 
                        className="relative flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
                        style={{
                          width: '44px',
                          height: '44px',
                          marginLeft: open ? '0px' : '-8px',
                          backgroundColor: open ? 'transparent' : 'rgb(255 255 255 / 0.9)',
                          boxShadow: open ? 'none' : '0 2px 8px rgb(0 0 0 / 0.04)',
                          border: open ? 'none' : '1px solid rgb(229 231 235 / 0.6)'
                        }}
                      >
                        <item.icon 
                          className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300" 
                          strokeWidth={1.5}
                        />
                        
                        {/* Subtle hover glow */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300"></div>
                      </div>
                      
                      {/* Text Label with smooth reveal */}
                      <div 
                        className="flex flex-col justify-center overflow-hidden transition-all duration-500 ease-out"
                        style={{
                          opacity: open ? 1 : 0,
                          transform: open ? 'translateX(0px)' : 'translateX(-8px)',
                          width: open ? 'auto' : '0px',
                          marginLeft: open ? '16px' : '0px',
                          transitionDelay: open ? `${index * 30}ms` : '0ms'
                        }}
                      >
                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                          {item.title}
                        </span>
                      </div>
                      
                      {/* Active indicator */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
        
        {/* Footer */}
        <SidebarFooter className="border-t border-gray-100/80 dark:border-gray-800/80 p-4 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50">
          <div 
            className="text-xs text-gray-400 dark:text-gray-500 transition-all duration-300 font-medium"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0px)' : 'translateY(4px)'
            }}
          >
            Query AI v2.1.0
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}

export default AppSidebar