"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk, SignUpButton, SignInButton, UserButton } from "@clerk/nextjs";
import {
  MessageSquarePlus,
  Archive,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
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
    title: "New Chat",
    path: "/",
    icon: MessageSquarePlus,
  },
  {
    title: "Vault",
    path: "/vault",
    icon: Archive,
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


  const router = useRouter();
  
  // Clerk hooks
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();







  const handleNewChat = () => {
  console.log("Saving old chat..."); // placeholder for later save logic

  if (path === "/") {
    // Already on chat page → reset state via event
    window.dispatchEvent(new Event("new-chat"));
  } else {
    router.push("/"); // Navigate to home
    // Let ChatInputBox know we need reset once loaded
    setTimeout(() => {
      window.dispatchEvent(new Event("new-chat"));
    }, 100);
  }
};




  const handleSignOut = async () => {
    await signOut();
  };

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

      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`transition-all duration-200 hover:bg-accent/80 ${
                      path === item.path
                        ? "bg-accent font-medium"
                        : ""
                    }`}
                  >
                    <a
                      className={`flex items-center gap-3 ${amatic.variable}`}
                      href={item.path}
                      onClick={item.path === "/" ? (e) => {
                        e.preventDefault();
                        handleNewChat();
                      } : undefined}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className={`transition-all duration-300 ${
                        isCollapsed 
                          ? "opacity-0 w-0 overflow-hidden" 
                          : "opacity-100"
                      }`}>
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Auth Section */}
        <div className="p-2 space-y-2 border-t border-border/40">
          {!isSignedIn ? (
            <>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="sm"
                className={`w-full justify-center transition-all duration-300 ease-in-out font-medium border-border/60 hover:border-border ${
                  isCollapsed 
                    ? "h-8 w-8 p-0" 
                    : "h-9 px-3 justify-start"
                } ${amatic.variable}`}
                aria-label="Sign In"
                title="Sign In"
                onClick={() => (window.location.href = "/sign-in")}
              >
                <LogIn size={16} className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-2'}`} />
                <span className={`transition-all duration-300 ${
                  isCollapsed 
                    ? "opacity-0 w-0 overflow-hidden" 
                    : "opacity-100"
                }`}>
                  Sign In
                </span>
              </Button>
              </SignInButton>

            <SignUpButton mode="modal">
              <Button
                size="sm"
                className={`w-full justify-center transition-all duration-300 ease-in-out font-medium ${
                  isCollapsed 
                    ? "h-8 w-8 p-0" 
                    : "h-9 px-3 justify-start"
                } ${amatic.variable}`}
                aria-label="Sign Up"
                title="Sign Up"
                onClick={() => (window.location.href = "/sign-up")}
              >
                <UserPlus size={16} className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-2'}`} />
                <span className={`transition-all duration-300 ${
                  isCollapsed 
                    ? "opacity-0 w-0 overflow-hidden" 
                    : "opacity-100"
                }`}>
                  Sign Up
                </span>
              </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              {!isCollapsed && (
        <div className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground border border-border/40 rounded-md bg-muted/30">
    
        <div className="flex flex-col">
          <div className="font-medium text-foreground truncate">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </div>
            <div className="text-xs truncate">
            {user?.emailAddresses[0]?.emailAddress}
          </div>
        </div>
        <UserButton />
      </div>
      )}
              <Button
                variant="outline"
                size="sm"
                className={`w-full justify-center transition-all duration-300 ease-in-out font-medium border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 ${
                  isCollapsed 
                    ? "h-8 w-8 p-0" 
                    : "h-9 px-3 justify-start"
                } ${amatic.variable}`}
                aria-label="Sign Out"
                title="Sign Out"
                onClick={handleSignOut}
              >
                <LogOut size={16} className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-2'}`} />
                <span className={`transition-all duration-300 ${
                  isCollapsed 
                    ? "opacity-0 w-0 overflow-hidden" 
                    : "opacity-100"
                }`}>
                  Sign Out
                </span>
              </Button>
            </>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter>
        
        <div className={`px-3 py-2 text-xs text-muted-foreground/60 text-center transition-all duration-300 ${
          isCollapsed ? "px-1" : ""
        }`}>
          <span className={`transition-opacity duration-300 ${
            isCollapsed 
              ? "opacity-0" 
              : "opacity-100"
          }`}>
            {isCollapsed ? "v1" : "Version 1.0"}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}