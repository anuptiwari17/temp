"use client";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { amatic } from "@/lib/fonts";

export default function Navbar() {
  return (
    <header className="flex-shrink-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 w-full max-w-none">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1
              className={`${amatic.className} font-bold text-3xl`}
              style={{
                WebkitTextStroke: "0.5px var(--foreground)",
                color: "var(--foreground)",
              }}
            >
              Query
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
