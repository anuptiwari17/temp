"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import { amatic } from "@/lib/fonts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Paperclip, Send, Sparkles, Bot, Zap, Globe } from "lucide-react";
import { 
  aiModels, 
  getModelById, 
  getAllCustomModels, 
  getOpenRouterModels,
  getGoogleModels,
  getNvidiaModels 
} from "@/services/aiModels";
import { aiService } from "@/services/aiService";
import { v4 as uuidv4 } from 'uuid';
import { UserDetailContext } from "./../context/UserDetailContext";
import supabase from "@/services/supabase";
import { useRouter } from "next/navigation";

const messages = [
  "What's sparking your curiosity?",
  "Ready to explore something new?",
  "What's on your learning radar?",
  "Time to dive deep – what's the topic?",
  "Your next discovery starts here!",
  "What knowledge are you hunting for?",
  "Ready to unlock some insights?",
  "What's got you wondering today?",
  "Let's explore the unknown together!",
  "Curiosity activated – what's next?",
  "What rabbit hole shall we go down?",
  "Your learning adventure awaits!",
  "What's the question burning in your mind?",
  "Ready to expand your universe?",
  "What mystery shall we solve today?",
];

const getRandomMessage = () => messages[Math.floor(Math.random() * messages.length)];

export const ChatInputBox = ({ onResponse }) => {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  
  const [randomMessage] = useState(() => getRandomMessage());
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState("search");
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("best");
  const [showCustomModels, setShowCustomModels] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const router = useRouter();

  const customModels = getAllCustomModels();
  const openRouterModels = getOpenRouterModels();
  const googleModels = getGoogleModels();
  const nvidiaModels = getNvidiaModels();

  const needsLogin = !user;
  const isSubmitDisabled = !inputValue.trim() || isLoading;

  const storeQueryInLibrary = async (searchInput, type, webSearchEnabled) => {
    if (!user) {
      console.error("User must be logged in to store query");
      return null;
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      console.error("User email not available");
      return null;
    }

    const libId = uuidv4();
    const libraryEntry = {
      searchInput,
      userEmail,
      type,
      libId,
      web_search_enabled: webSearchEnabled
    };

    try {
      const { data, error } = await supabase
        .from('Library')
        .insert([libraryEntry])
        .select();

      if (error) {
        console.error("Error storing query in Library:", error);
        return null;
      }

      console.log("Query stored successfully");
      return data[0];
    } catch (error) {
      console.error("Exception storing query:", error);
      return null;
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading || !user) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const libraryEntry = await storeQueryInLibrary(userMessage, activeTab, webSearchEnabled);
    if (libraryEntry?.libId) {
      router.push('/search/' + libraryEntry.libId);
    }

    try {
      const currentModel = getModelById(selectedModel);
      let response;

      if (webSearchEnabled) {
        // First get search results
        const searchResponse = await fetch('/api/google-search-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: userMessage
          })
        });

        const searchResults = await searchResponse.json();
        
        if (!searchResults.success) {
          throw new Error(searchResults.error || 'Search failed');
        }

        // Then generate AI response with search context
        const systemPrompt = aiService.getSystemPromptWithSearch(activeTab, searchResults.results);
        
        response = await aiService.generateResponse(
          selectedModel,
          userMessage,
          [],
          {
            systemPrompt: systemPrompt,
            temperature: 0.7,
            maxTokens: 2000
          }
        );

        // Add search results to response
        response.searchResults = searchResults.results;
      } else {
        // Regular AI response without search
        const systemPrompt = aiService.getSystemPrompt(activeTab);
        
        response = await aiService.generateResponse(
          selectedModel,
          userMessage,
          [],
          {
            systemPrompt: systemPrompt,
            temperature: 0.7,
            maxTokens: 2000
          }
        );
      }

      console.log("AI Response received:", response);

      if (onResponse) {
        onResponse({
          userMessage,
          response,
          mode: activeTab,
          model: currentModel,
          webSearchEnabled,
          timestamp: new Date().toISOString(),
          libraryEntry
        });
      }
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
          webSearchEnabled,
          timestamp: new Date().toISOString(),
          libraryEntry
        });
      }
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    const resetChat = () => {
      setInputValue("");
      setActiveTab("search");
      setWebSearchEnabled(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    };

    window.addEventListener("new-chat", resetChat);
    return () => window.removeEventListener("new-chat", resetChat);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 gap-8" onClick={(e) => {
      if (!e.target.closest('.relative')) {
        setShowCustomModels(false);
      }
    }}>
      
      {needsLogin ? (
        <div className="w-full max-w-md text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Sign in to start learning</h2>
            <p className="text-sm text-muted-foreground">Access personalized AI learning and save your progress</p>
          </div>
        </div>
      ) : (
        <>
          <h2
            className={`${amatic.className} font-bold text-center text-[clamp(24px,5vw,42px)] text-foreground/90 tracking-wide`}
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {randomMessage}
          </h2>

          <div className="w-full max-w-2xl">
            <div className={`bg-card/90 backdrop-blur-sm rounded-2xl border transition-all duration-200 ${
              isFocused 
                ? "border-primary/50 shadow-lg shadow-primary/5" 
                : "border-border/40 shadow-sm"
            }`}>
              
              <div className="p-5">
                <Tabs defaultValue="search" className="w-full" onValueChange={setActiveTab}>
               
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

                  {/* Web Search Toggle */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-muted/20 rounded-lg">
                    <button
                      onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        webSearchEnabled
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-background/60 text-muted-foreground hover:bg-background/80"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Web Search
                    </button>
                    <div className="flex-1 text-xs text-muted-foreground">
                      {webSearchEnabled 
                        ? "Search the web for up-to-date information and sources"
                        : "Use AI knowledge only"
                      }
                    </div>
                  </div>

                  <div className="relative mb-4">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      disabled={isLoading}
                      placeholder={
                        webSearchEnabled 
                          ? (activeTab === "search" ? "Search the web and learn..." : "Research current topics deeply...")
                          : (activeTab === "search" ? "What would you like to learn?" : "What topic to study deeply?")
                      }
                      rows={1}
                      className="w-full bg-transparent text-foreground border-0 focus:outline-none resize-none text-base placeholder:text-muted-foreground/60 leading-relaxed disabled:opacity-50"
                      style={{ 
                        maxHeight: "120px", 
                        minHeight: "20px"
                      }}
                    />
                    
                    <div className={`absolute bottom-0 left-0 h-px bg-primary transition-all duration-300 ${
                      isFocused ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}></div>
                    
                    {!inputValue && !isFocused && !isLoading && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20">
                        {webSearchEnabled ? (
                          <Globe className="w-4 h-4 text-primary" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    )}

                    {isLoading && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
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

                      {showCustomModels && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-card/95 backdrop-blur-sm border border-border/40 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                          <div className="p-2">
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

                            <div className="h-px bg-border/30 my-2"></div>

                            {renderModelGroup(googleModels, "Google AI", "bg-blue-50 dark:bg-blue-900/20")}
                            {renderModelGroup(nvidiaModels, "NVIDIA", "bg-green-50 dark:bg-green-900/20")}
                            {renderModelGroup(openRouterModels, "Others", "bg-purple-50 dark:bg-purple-900/20")}
                          </div>
                        </div>
                      )}
                    </div>

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
                        disabled={isSubmitDisabled}
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

                  <TabsContent value="search" className="hidden" />
                  <TabsContent value="research" className="hidden" />
                </Tabs>
              </div>
            </div>

            <div className="text-center mt-3 space-y-1">
              <p className="text-xs text-muted-foreground/40">
                <kbd className="px-1 py-0.5 text-xs bg-muted/15 rounded">⏎</kbd> send • <kbd className="px-1 py-0.5 text-xs bg-muted/15 rounded">⇧⏎</kbd> new line
              </p>
              {selectedModel !== "best" && (
                <p className="text-xs text-muted-foreground/30">
                  Using {getModelById(selectedModel).name} • {getModelById(selectedModel).provider}
                </p>
              )}
              {webSearchEnabled && (
                <p className="text-xs text-primary/60">
                  🌐 Web search enabled
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};