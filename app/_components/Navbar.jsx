"use client";
import React, { useState, useEffect } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar({ onToggleSidebar }) {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Left side - Sidebar toggle and logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="lg:hidden" onClick={onToggleSidebar}>
            <Menu size={20} />
          </SidebarTrigger>
          
          {/* Logo and title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Query</h1>
          </div>
        </div>

        {/* Right side - Theme toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-md transition-all duration-200 hover:bg-accent"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <Sun size={18} className="text-amber-500" />
            ) : (
              <Moon size={18} className="text-slate-700" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}