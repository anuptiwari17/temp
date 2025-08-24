// /app/services/aiService.js - Updated to use API routes
import { getModelById, getBestAvailableModel } from './aiModels';

class AIService {
  constructor() {
    this.apiEndpoint = '/api/chat';
  }

  // Main method to generate response based on model configuration
  async generateResponse(modelId, userMessage, conversationHistory = [], options = {}) {
    try {
      // Get model configuration
      let modelConfig;
      if (modelId === 'best') {
        modelConfig = getBestAvailableModel();
      } else {
        modelConfig = getModelById(modelId);
      }

      if (!modelConfig) {
        throw new Error(`Model ${modelId} not found`);
      }

      // Prepare messages in OpenAI format
      const messages = this.prepareMessages(userMessage, conversationHistory, options.systemPrompt);

      // Call API route instead of direct service calls
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelConfig,
          messages,
          options
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error.message,
        content: null,
        modelUsed: null,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Stream response method - for future implementation
  async generateStreamResponse(modelId, userMessage, conversationHistory = [], options = {}) {
    // For now, fallback to regular response
    // You can implement streaming later if needed
    return this.generateResponse(modelId, userMessage, conversationHistory, options);
  }

  // Prepare messages in the correct format
  prepareMessages(userMessage, conversationHistory = [], systemPrompt = null) {
    const messages = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    } else {
      // Default system prompt for study agent
      messages.push({
        role: 'system',
        content: 'You are a helpful AI study assistant. Provide clear, accurate, and educational responses to help users learn effectively.'
      });
    }

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  // Get system prompts for different modes
  getSystemPrompt(mode = 'search') {
    const prompts = {
      search: 'You are a helpful AI study assistant focused on learning and research. Provide clear, accurate, and educational responses. When possible, break down complex topics into understandable parts and suggest related topics for further study.',
      research: 'You are an AI research assistant specializing in deep academic study. Provide comprehensive, well-structured responses with detailed explanations. Include relevant examples, cite important concepts, and suggest areas for deeper investigation.',
      general: 'You are a helpful AI assistant. Provide accurate, helpful, and informative responses to user queries.'
    };

    return prompts[mode] || prompts.general;
  }

  // Method specifically for reasoning with NVIDIA models
  async generateWithReasoning(modelId, userMessage, conversationHistory = [], options = {}) {
    const modelConfig = getModelById(modelId);
    
    if (modelConfig?.apiType !== 'nvidia') {
      throw new Error('Reasoning is only available with NVIDIA models');
    }

    // Add reasoning options
    const reasoningOptions = {
      ...options,
      enableReasoning: true,
      minThinkingTokens: options.minThinkingTokens || 1000,
      maxThinkingTokens: options.maxThinkingTokens || 10000
    };

    return this.generateResponse(modelId, userMessage, conversationHistory, reasoningOptions);
  }

  // Test API connectivity
  async testConnections() {
    const testModels = [
      { id: 'deepseek-r1-0528', name: 'OpenRouter' },
      { id: 'gemini-flash', name: 'Google' },
      { id: 'nemotron-70b', name: 'NVIDIA' }
    ];

    const results = {};

    for (const model of testModels) {
      try {
        const response = await this.generateResponse(
          model.id,
          'Hi',
          [],
          { maxTokens: 10 }
        );
        results[model.name.toLowerCase()] = response.success;
      } catch (error) {
        console.error(`${model.name} test failed:`, error);
        results[model.name.toLowerCase()] = false;
      }
    }

    return results;
  }
}

export const aiService = new AIService();