// /app/services/openRouterService.js

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  async generateResponse(modelConfig, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not found');
    }

    const requestBody = {
      model: modelConfig.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
      stream: options.stream || false
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'Study Agent'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        content: data.choices[0]?.message?.content || 'No response received',
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  }

  async generateStreamResponse(modelConfig, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not found');
    }

    const requestBody = {
      model: modelConfig.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      stream: true
    };

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'Study Agent'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('OpenRouter Stream Error:', error);
      throw error;
    }
  }
}

export const openRouterService = new OpenRouterService();