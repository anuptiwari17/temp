// /app/services/nvidiaService.js

class NvidiaService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_NVIDIA_API_KEY || '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';
    this.baseURL = 'https://integrate.api.nvidia.com/v1';
  }

  async generateResponse(modelConfig, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('NVIDIA API key not found');
    }

    const requestBody = {
      model: modelConfig.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      max_tokens: options.maxTokens || 2000,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
      stream: options.stream || false
    };

    // Add extra_body for reasoning models if needed
    if (options.enableReasoning) {
      requestBody.extra_body = {
        min_thinking_tokens: options.minThinkingTokens || 1000,
        max_thinking_tokens: options.maxThinkingTokens || 10000
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`NVIDIA API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      const content = data.choices[0]?.message?.content || 'No response received';
      const reasoning = data.choices[0]?.message?.reasoning_content;
      
      return {
        success: true,
        content: content,
        reasoning: reasoning, // Include reasoning if available
        usage: data.usage,
        model: data.model
      };
    } catch (error) {
      console.error('NVIDIA API Error:', error);
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  }

  async generateStreamResponse(modelConfig, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('NVIDIA API key not found');
    }

    const requestBody = {
      model: modelConfig.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      max_tokens: options.maxTokens || 2000,
      stream: true
    };

    // Add extra_body for reasoning models if needed
    if (options.enableReasoning) {
      requestBody.extra_body = {
        min_thinking_tokens: options.minThinkingTokens || 1000,
        max_thinking_tokens: options.maxThinkingTokens || 10000
      };
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`NVIDIA API error: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('NVIDIA Stream Error:', error);
      throw error;
    }
  }

  // Special method for reasoning-enabled generation
  async generateWithReasoning(modelConfig, messages, options = {}) {
    return this.generateResponse(modelConfig, messages, {
      ...options,
      enableReasoning: true,
      minThinkingTokens: options.minThinkingTokens || 1000,
      maxThinkingTokens: options.maxThinkingTokens || 10000
    });
  }
}

export const nvidiaService = new NvidiaService();