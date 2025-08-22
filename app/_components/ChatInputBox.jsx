import React from "react";
import { amatic } from "@/lib/fonts";

export const ChatInputBox = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[200px] gap-[clamp(8px,4vw,32px)] px-4"
    >
      <h2
        className={`${amatic.className} font-bold text-center 
                   text-[clamp(24px,6vw,48px)]`}
        style={{
          WebkitTextStroke: "0.5px var(--foreground)",
          color: "var(--foreground)",
        }}
      >
        What's Your Agenda today?
      </h2>

      <input
        type="text"
        placeholder="Type your query..."
        className="px-4 py-3 w-full max-w-md 
                   bg-background text-foreground 
                   border border-border rounded-2xl 
                   focus:outline-none focus:ring-2 focus:ring-ring 
                   transition-all duration-200"
      />
    </div>
  );
};
