"use client";
import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Paperclip, Send, Sparkles, Bot, Zap } from "lucide-react";
import { 
  aiModels, 
  getModelById, 
  getAllCustomModels, 
  getOpenRouterModels,
  getGoogleModels,
  getNvidiaModels 
} from "@/services/aiModels";
import { aiService } from "@/services/aiService";

export const ChatInputBox = ({ onResponse }) => {
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState("search");
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("best");
  const [showCustomModels, setShowCustomModels] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const customModels = getAllCustomModels();
  const openRouterModels = getOpenRouterModels();
  const googleModels = getGoogleModels();
  const nvidiaModels = getNvidiaModels();

  const handleInput = (e) => {
    setInputValue(e.target.value);
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handleSubmit = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage = inputValue.trim();
      setInputValue("");
      setIsLoading(true);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const currentModel = getModelById(selectedModel);
        console.log("Submitting with model:", currentModel);

        // Get system prompt based on active tab
        const systemPrompt = aiService.getSystemPrompt(activeTab);
        
        // Generate response
        const response = await aiService.generateResponse(
          selectedModel,
          userMessage,
          [], // conversation history - you can maintain this in parent component
          {
            systemPrompt: systemPrompt,
            temperature: 0.7,
            maxTokens: 2000
          }
        );

        // Call parent callback with response
        if (onResponse) {
          onResponse({
            userMessage,
            response,
            mode: activeTab,
            model: currentModel,
            timestamp: new Date().toISOString()
          });
        }

        console.log("AI Response:", response);
      } catch (error) {
        console.error("Error generating response:", error);
        if (onResponse) {
          onResponse({
            userMessage,
            response: {
              success: false,
              error: error.message,
              content: null
            },
            mode: activeTab,
            model: getModelById(selectedModel),
            timestamp: new Date().toISOString()
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    setShowCustomModels(false);
  };

  const getModelIcon = (model) => {
    switch (model.apiType) {
      case 'google':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'nvidia':
        return <Zap className="w-4 h-4 text-green-500" />;
      case 'openrouter':
        return <Bot className="w-4 h-4 text-purple-500" />;
      case 'best':
        return <Sparkles className="w-4 h-4 text-primary" />;
      default:
        return <Bot className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const renderModelGroup = (models, title, bgColor = "bg-muted/20") => {
    if (models.length === 0) return null;

    return (
      <div className="mb-2">
        <div className={`px-2 py-1 text-xs font-medium text-muted-foreground ${bgColor} rounded-md mb-1`}>
          {title}
        </div>
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => handleModelSelect(model.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
              selectedModel === model.id 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted/50 text-foreground"
            }`}
          >
            {getModelIcon(model)}
            <div className="flex-1">
              <div className="font-medium text-sm">{model.name}</div>
              <div className="text-xs text-muted-foreground">{model.desc}</div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4" onClick={(e) => {
      if (!e.target.closest('.relative')) {
        setShowCustomModels(false);
      }
    }}>
      <div className="w-full max-w-2xl">
        {/* Clean Modern Card */}
        <div className={`bg-card/90 backdrop-blur-sm rounded-2xl border transition-all duration-200 ${
          isFocused 
            ? "border-primary/50 shadow-lg shadow-primary/5" 
            : "border-border/40 shadow-sm"
        }`}>
          
          <div className="p-5">
            <Tabs defaultValue="search" className="w-full" onValueChange={setActiveTab}>
              {/* Minimal Mode Tabs */}
              <TabsList className="grid w-full grid-cols-2 bg-background/60 rounded-xl p-1 h-9 mb-4">
                <TabsTrigger
                  value="search"
                  className="flex items-center gap-1.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  Learn
                </TabsTrigger>
                <TabsTrigger
                  value="research"
                  className="flex items-center gap-1.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Study
                </TabsTrigger>
              </TabsList>

              {/* Text Input */}
              <div className="relative mb-4">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isLoading}
                  placeholder={activeTab === "search" ? "What would you like to learn?" : "What topic to study deeply?"}
                  rows={1}
                  className="w-full bg-transparent text-foreground border-0 focus:outline-none resize-none text-base placeholder:text-muted-foreground/60 leading-relaxed disabled:opacity-50"
                  style={{ 
                    maxHeight: "120px", 
                    minHeight: "20px"
                  }}
                />
                
                {/* Focus line */}
                <div className={`absolute bottom-0 left-0 h-px bg-primary transition-all duration-300 ${
                  isFocused ? "w-full opacity-100" : "w-0 opacity-0"
                }`}></div>
                
                {/* Sparkle hint */}
                {!inputValue && !isFocused && !isLoading && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between gap-3">
                {/* Model Selector - Enhanced with Provider Grouping */}
                <div className="relative">
                  <Button
                    onClick={() => setShowCustomModels(!showCustomModels)}
                    variant="ghost"
                    disabled={isLoading}
                    className="h-8 px-3 rounded-lg hover:bg-muted/30 transition-colors text-xs font-medium disabled:opacity-50"
                  >
                    {getModelIcon(getModelById(selectedModel))}
                    <span className="ml-1.5">
                      {selectedModel === "best" ? "Best" : getModelById(selectedModel).name}
                    </span>
                  </Button>

                  {/* Enhanced Models Dropdown with Provider Grouping */}
                  {showCustomModels && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-card/95 backdrop-blur-sm border border-border/40 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                      <div className="p-2">
                        {/* Best Option */}
                        <button
                          onClick={() => handleModelSelect("best")}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors mb-2 ${
                            selectedModel === "best" 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-muted/50 text-foreground"
                          }`}
                        >
                          <Sparkles className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium text-sm">{aiModels.best.name}</div>
                            <div className="text-xs text-muted-foreground">{aiModels.best.desc}</div>
                          </div>
                        </button>

                        {/* Separator */}
                        <div className="h-px bg-border/30 my-2"></div>

                        {/* Google Models */}
                        {renderModelGroup(googleModels, "Google AI", "bg-blue-50 dark:bg-blue-900/20")}

                        {/* NVIDIA Models */}
                        {renderModelGroup(nvidiaModels, "NVIDIA", "bg-green-50 dark:bg-green-900/20")}

                        {/* OpenRouter Models */}
                        {renderModelGroup(openRouterModels, "OpenRouter", "bg-purple-50 dark:bg-purple-900/20")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    className="w-8 h-8 rounded-lg hover:bg-muted/30 transition-colors disabled:opacity-50"
                    title="Upload study materials"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                      inputValue.trim() && !isLoading
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        : "bg-muted/30 text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Hidden tab content */}
              <TabsContent value="search" className="hidden" />
              <TabsContent value="research" className="hidden" />
            </Tabs>
          </div>
        </div>

        {/* Enhanced Shortcuts with Model Info */}
        <div className="text-center mt-3 space-y-1">
          <p className="text-xs text-muted-foreground/40">
            <kbd className="px-1 py-0.5 text-xs bg-muted/15 rounded">⏎</kbd> send • <kbd className="px-1 py-0.5 text-xs bg-muted/15 rounded">⇧⏎</kbd> new line
          </p>
          {selectedModel !== "best" && (
            <p className="text-xs text-muted-foreground/30">
              Using {getModelById(selectedModel).name} • {getModelById(selectedModel).provider}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};