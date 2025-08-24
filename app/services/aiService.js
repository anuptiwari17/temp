// /app/services/aiService.js
import { getModelById, getBestAvailableModel } from './aiModels';
import { openRouterService } from './openRouterService';
import { googleService } from './googleService';
import { nvidiaService } from './nvidiaService';

class AIService {
  constructor() {
    this.services = {
      openrouter: openRouterService,
      google: googleService,
      nvidia: nvidiaService
    };
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

      // Route to appropriate service
      const service = this.services[modelConfig.apiType];
      if (!service) {
        throw new Error(`Service for ${modelConfig.apiType} not found`);
      }

      // Generate response
      const response = await service.generateResponse(modelConfig, messages, options);
      
      return {
        ...response,
        modelUsed: modelConfig,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error.message,
        content: null,
        modelUsed: null
      };
    }
  }

  // Stream response method
  async generateStreamResponse(modelId, userMessage, conversationHistory = [], options = {}) {
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

      // Prepare messages
      const messages = this.prepareMessages(userMessage, conversationHistory, options.systemPrompt);

      // Route to appropriate service
      const service = this.services[modelConfig.apiType];
      if (!service) {
        throw new Error(`Service for ${modelConfig.apiType} not found`);
      }

      // Generate stream response
      return await service.generateStreamResponse(modelConfig, messages, options);

    } catch (error) {
      console.error('AI Stream Service Error:', error);
      throw error;
    }
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

    const messages = this.prepareMessages(userMessage, conversationHistory, options.systemPrompt);
    
    return await nvidiaService.generateWithReasoning(modelConfig, messages, options);
  }

  // Test all services connectivity
  async testConnections() {
    const results = {
      openrouter: false,
      google: false,
      nvidia: false
    };

    // Test OpenRouter
    try {
      const response = await openRouterService.generateResponse(
        { model: 'meta-llama/llama-3.1-8b-instruct:free' },
        [{ role: 'user', content: 'Hi' }],
        { maxTokens: 10 }
      );
      results.openrouter = response.success;
    } catch (error) {
      console.error('OpenRouter test failed:', error);
    }

    // Test Google
    try {
      const response = await googleService.generateResponse(
        { model: 'gemini-2.0-flash' },
        [{ role: 'user', content: 'Hi' }],
        { maxTokens: 10 }
      );
      results.google = response.success;
    } catch (error) {
      console.error('Google test failed:', error);
    }

    // Test NVIDIA
    try {
      const response = await nvidiaService.generateResponse(
        { model: 'nvidia/llama-3.1-nemotron-70b-instruct' },
        [{ role: 'user', content: 'Hi' }],
        { maxTokens: 10 }
      );
      results.nvidia = response.success;
    } catch (error) {
      console.error('NVIDIA test failed:', error);
    }

    return results;
  }
}

export const aiService = new AIService();