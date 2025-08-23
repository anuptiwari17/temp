"use client"
import React, { useRef } from "react";
import { amatic } from "@/lib/fonts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ChatInputBox = () => {
  const messages = [
    "Hey, what’s on your mind?",
    "What can I help you explore today?",
    "Ready to dive in?",
    "Got a question?",
    "What shall we search for?",
    "Your curiosity starts here!",
    "What's next on your journey?",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const textareaRef = useRef(null);

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
      
      <h2
        className={`${amatic.className} font-bold text-center text-[clamp(22px,5vw,36px)]`}
        style={{
          WebkitTextStroke: "0.5px var(--foreground)",
          color: "var(--foreground)",
        }}
      >
        {randomMessage}
      </h2>

      <div className="w-full max-w-md border rounded-2xl p-5 flex flex-col gap-4 shadow-sm bg-background">
        <textarea
          ref={textareaRef}
          placeholder="Type your query..."
          onInput={handleInput}
          rows={1} 
          className="px-4 py-2 w-full bg-background text-foreground border border-border rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 resize-none overflow-auto"
          style={{ maxHeight: "200px", transition: "height 0.15s ease" }}
        />

        <Tabs defaultValue="search" className="w-full flex flex-col items-center">
          <TabsList className="flex gap-2 rounded-md bg-muted/40 p-1">
            <TabsTrigger value="search" className="px-4 py-1 text-sm rounded-md">
              Search
            </TabsTrigger>
            <TabsTrigger value="research" className="px-4 py-1 text-sm rounded-md">
              Research
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="search"
            className="mt-3 text-sm text-muted-foreground text-center"
          >
            Start a quick search here.
          </TabsContent>
          <TabsContent
            value="research"
            className="mt-3 text-sm text-muted-foreground text-center"
          >
            Dive deep into research mode here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
