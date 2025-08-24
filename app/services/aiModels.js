// /app/services/aiModels.js
export const aiModels = {
  // Best option (will route to best available model)
  best: {
    id: "best",
    name: "Best",
    desc: "Optimal for learning",
    provider: "Auto",
    apiType: "best", // Special handling
    model: null
  },
  
  // OpenRouter Models (Free)
  "llama-3.1-8b": {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    desc: "Fast and efficient reasoning",
    provider: "OpenRouter",
    apiType: "openrouter",
    model: "meta-llama/llama-3.1-8b-instruct:free"
  },
  "mistral-7b": {
    id: "mistral-7b", 
    name: "Mistral 7B",
    desc: "Great for general tasks",
    provider: "OpenRouter",
    apiType: "openrouter",
    model: "mistralai/mistral-7b-instruct:free"
  },
  "qwen-14b": {
    id: "qwen-14b",
    name: "Qwen 2.5 14B",
    desc: "Excellent multilingual support",
    provider: "OpenRouter",
    apiType: "openrouter",
    model: "qwen/qwen-2.5-14b-instruct:free"
  },
  
  // Google Direct API (Free)
  "gemini-flash": {
    id: "gemini-flash",
    name: "Gemini 2.0 Flash",
    desc: "Lightning fast responses",
    provider: "Google", 
    apiType: "google",
    model: "gemini-2.0-flash"
  },
  "gemini-flash-15": {
    id: "gemini-flash-15",
    name: "Gemini 1.5 Flash",
    desc: "Balanced speed and quality",
    provider: "Google",
    apiType: "google",
    model: "gemini-1.5-flash"
  },
  
  // NVIDIA Direct API (Free)
  "nemotron-70b": {
    id: "nemotron-70b",
    name: "Nemotron 70B",
    desc: "Powerful reasoning capabilities",
    provider: "NVIDIA",
    apiType: "nvidia",
    model: "nvidia/llama-3.1-nemotron-70b-instruct"
  }
};

// Helper functions
export const getModelById = (id) => {
  return aiModels[id] || aiModels.best;
};

export const getOpenRouterModels = () => {
  return Object.values(aiModels).filter(model => model.apiType === "openrouter");
};

export const getGoogleModels = () => {
  return Object.values(aiModels).filter(model => model.apiType === "google");
};

export const getNvidiaModels = () => {
  return Object.values(aiModels).filter(model => model.apiType === "nvidia");
};

export const getDirectApiModels = () => {
  return Object.values(aiModels).filter(model => 
    model.apiType === "google" || model.apiType === "nvidia"
  );
};

export const getAllCustomModels = () => {
  return Object.values(aiModels).filter(model => model.id !== "best");
};

export const getBestAvailableModel = () => {
  // Priority order: Google > NVIDIA > OpenRouter
  const googleModels = getGoogleModels();
  if (googleModels.length > 0) return googleModels[0];
  
  const nvidiaModels = getNvidiaModels();
  if (nvidiaModels.length > 0) return nvidiaModels[0];
  
  const openRouterModels = getOpenRouterModels();
  if (openRouterModels.length > 0) return openRouterModels[0];
  
  return aiModels["gemini-flash"]; // fallback
};