"use client";
import React, { useState, useEffect } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { amatic } from "@/lib/fonts";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
      
      setIsDark(shouldBeDark);
      document.documentElement.classList.toggle("dark", shouldBeDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme ? "dark" : "light");
    }
  };

  return (
    <header className="flex-shrink-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 w-full max-w-none">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          
<div className="flex items-center gap-2">
  <h1
    className={`${amatic.className} font-bold text-3xl bg-background text-foreground`}
    style={{
      WebkitTextStroke: "0.5px var(--foreground)",
      color: "var(--foreground)",
    }}
  >
    Query
  </h1>
</div>



        </div>

        {/* Right side - Theme toggle */}
        <div className="flex items-center gap-2">
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