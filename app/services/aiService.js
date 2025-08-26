//implementation completed with web search support
import { getModelById, getBestAvailableModel } from './aiModels';

class AIService {
  constructor() {
    this.apiEndpoint = '/api/chat';
  }

  //main method to generate response based on model configuration
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

      //prepare messages in OpenAI format
      const messages = this.prepareMessages(userMessage, conversationHistory, options.systemPrompt);

      //calling API route instead of direct service calls
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

  //stream response method - for future implementation
  async generateStreamResponse(modelId, userMessage, conversationHistory = [], options = {}) {
    // For now, falling back to regular response
    // can implement streaming later if needed
    return this.generateResponse(modelId, userMessage, conversationHistory, options);
  }

  //preparing messages in the correct format
  prepareMessages(userMessage, conversationHistory = [], systemPrompt = null) {
    const messages = [];

    //adding system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    } else {
      //default system prompt for study agent
      messages.push({
        role: 'system',
        content: 'You are a helpful AI study assistant. Provide clear, accurate, and educational responses to help users learn effectively.'
      });
    }

    //adding conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    //adding current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  //get system prompts for different modes (WITHOUT web search)
  getSystemPrompt(mode = 'search') {
    const prompts = {
      search: 'You are a helpful AI study assistant focused on learning and research. Provide clear, accurate, and educational responses. When possible, break down complex topics into understandable parts and suggest related topics for further study. Use your training knowledge to provide comprehensive explanations.',
      research: 'You are an AI research assistant specializing in deep academic study. Provide comprehensive, well-structured responses with detailed explanations. Include relevant examples, cite important concepts, and suggest areas for deeper investigation. Draw from your extensive training knowledge.',
      general: 'You are a helpful AI assistant. Provide accurate, helpful, and informative responses to user queries.'
    };

    return prompts[mode] || prompts.general;
  }

  //get system prompts WITH web search context
  getSystemPromptWithSearch(mode, searchResults) {
    if (!searchResults || searchResults.length === 0) {
      return this.getSystemPrompt(mode);
    }

    //formatting search results for the AI
    const searchContext = searchResults.map((result, index) => 
      `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.link}\n`
    ).join('\n');

    const basePrompt = mode === 'search' 
      ? `You are an AI learning assistant. Help users understand topics clearly and provide educational insights.`
      : `You are an AI research assistant. Provide comprehensive, well-structured analysis and deep insights on topics.`;

    return `${basePrompt}

IMPORTANT INSTRUCTIONS FOR WEB SEARCH RESPONSES:
- Use the following search results to provide accurate, up-to-date information
- Always cite sources using [1], [2], etc. format when referencing information from the search results
- If search results don't contain enough information, clearly state the limitations
- Provide a comprehensive answer that synthesizes information from multiple sources
- Structure your response clearly with headings if appropriate
- Be specific about which information comes from which source

SEARCH RESULTS:
${searchContext}

Guidelines:
1. Start with a clear, direct answer to the user's question
2. Use numbered citations [1], [2], etc. when referencing specific information from sources
3. Synthesize information from multiple sources when possible
4. If sources conflict, mention the different perspectives
5. Include relevant details that add educational value
6. Conclude with key takeaways or next steps for learning

User Query: `;
  }

  //method specifically for reasoning with NVIDIA models
  async generateWithReasoning(modelId, userMessage, conversationHistory = [], options = {}) {
    const modelConfig = getModelById(modelId);
    
    if (modelConfig?.apiType !== 'nvidia') {
      throw new Error('Reasoning is only available with NVIDIA models');
    }

    //adding reasoning options
    const reasoningOptions = {
      ...options,
      enableReasoning: true,
      minThinkingTokens: options.minThinkingTokens || 1000,
      maxThinkingTokens: options.maxThinkingTokens || 10000
    };

    return this.generateResponse(modelId, userMessage, conversationHistory, reasoningOptions);
  }

  //generating response with web search integration
  async generateResponseWithSearch(modelId, userMessage, searchResults, conversationHistory = [], options = {}) {
    try {
      //creating system prompt with search context
      const mode = options.mode || 'search';
      const systemPrompt = this.getSystemPromptWithSearch(mode, searchResults);

      //generating response with search context
      return await this.generateResponse(
        modelId,
        userMessage,
        conversationHistory,
        {
          ...options,
          systemPrompt: systemPrompt
        }
      );
    } catch (error) {
      console.error('Error generating response with search:', error);
      return {
        success: false,
        error: error.message,
        content: null,
        modelUsed: null,
        timestamp: new Date().toISOString()
      };
    }
  }

  //performing web search and generate AI response
  async searchAndGenerate(query, options = {}) {
    try {
      //first perform web search
      const searchResponse = await fetch('/api/google-search-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      const searchData = await searchResponse.json();
      
      if (!searchData.success) {
        throw new Error(searchData.error || 'Web search failed');
      }

      //then generate AI response with search context
      return await this.generateResponseWithSearch(
        options.modelId || 'best',
        query,
        searchData.results,
        options.conversationHistory || [],
        options
      );

    } catch (error) {
      console.error('Search and generate error:', error);
      return {
        success: false,
        error: error.message,
        content: null,
        searchResults: [],
        modelUsed: null,
        timestamp: new Date().toISOString()
      };
    }
  }

  //test API connectivity
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

  //test web search functionality
  async testWebSearch() {
    try {
      const response = await fetch('/api/google-search-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'test search' })
      });

      const data = await response.json();
      return {
        success: data.success,
        resultsCount: data.results?.length || 0,
        error: data.error || null
      };
    } catch (error) {
      return {
        success: false,
        resultsCount: 0,
        error: error.message
      };
    }
  }

  //utility method to clean and format AI responses
  formatResponse(content) {
    if (!content) return '';
    
    return content
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\s+\n/g, '\n') // Clean line endings
      .trim();
  }

  // Get available models for the UI
  getAvailableModels() {
    // This would typically come from your aiModels service
    return {
      best: getBestAvailableModel(),
      all: [
        // Return all available models from your aiModels service
      ]
    };
  }

  // Validate model configuration
  validateModelConfig(modelConfig) {
    if (!modelConfig) {
      throw new Error('Model configuration is required');
    }

    if (!modelConfig.apiType) {
      throw new Error('Model API type is required');
    }

    if (!modelConfig.model) {
      throw new Error('Model identifier is required');
    }

    return true;
  }

  // Error handler for graceful degradation
  handleApiError(error, fallbackMessage = 'An error occurred while processing your request') {
    console.error('AI Service API Error:', error);
    
    return {
      success: false,
      error: error.message || fallbackMessage,
      content: null,
      modelUsed: null,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const aiService = new AIService();

// Also export the class for testing purposes
export { AIService };