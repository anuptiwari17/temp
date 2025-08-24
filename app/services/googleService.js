// /app/services/googleService.js

class GoogleService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'AIzaSyBQ4Dp5elJJRt5h30uWTe5oRkXdZPFEZK8';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  // Convert OpenAI format messages to Gemini format
  convertMessagesToGeminiFormat(messages) {
    const contents = [];
    
    for (const message of messages) {
      if (message.role === 'system') {
        // System messages are handled differently in Gemini
        // We'll prepend system context to the first user message
        continue;
      }
      
      contents.push({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }]
      });
    }
    
    return contents;
  }

  async generateResponse(modelConfig, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('Google API key not found');
    }

    // Handle system message
    let systemContext = '';
    const systemMessage = messages.find(msg => msg.role === 'system');
    if (systemMessage) {
      systemContext = systemMessage.content + '\n\n';
    }

    const contents = this.convertMessagesToGeminiFormat(messages);
    
    // Add system context to first user message if exists
    if (systemContext && contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts[0].text = systemContext + contents[0].parts[0].text;
    }

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2000,
        topP: options.topP || 1,
      }
    };

    try {
      const response = await fetch(`${this.baseURL}/models/${modelConfig.model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
      
      return {
        success: true,
        content: content,
        usage: data.usageMetadata,
        model: modelConfig.model
      };
    } catch (error) {
      console.error('Google API Error:', error);
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  }

  async generateStreamResponse(modelConfig, messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('Google API key not found');
    }

    // Handle system message
    let systemContext = '';
    const systemMessage = messages.find(msg => msg.role === 'system');
    if (systemMessage) {
      systemContext = systemMessage.content + '\n\n';
    }

    const contents = this.convertMessagesToGeminiFormat(messages);
    
    // Add system context to first user message if exists
    if (systemContext && contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts[0].text = systemContext + contents[0].parts[0].text;
    }

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 2000,
        topP: options.topP || 1,
      }
    };

    try {
      const response = await fetch(`${this.baseURL}/models/${modelConfig.model}:streamGenerateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Google API error: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Google Stream Error:', error);
      throw error;
    }
  }

  // Chat functionality for conversation history
  async createChat(modelConfig, history = []) {
    return {
      model: modelConfig.model,
      history: this.convertMessagesToGeminiFormat(history),
      
      async sendMessage(message, options = {}) {
        const contents = [...this.history, {
          role: 'user',
          parts: [{ text: message }]
        }];

        const response = await googleService.generateResponse(
          { model: this.model },
          this.convertGeminiToOpenAIFormat(contents),
          options
        );

        if (response.success) {
          // Add to history
          this.history.push(
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: response.content }] }
          );
        }

        return response;
      },

      convertGeminiToOpenAIFormat(geminiContents) {
        return geminiContents.map(content => ({
          role: content.role === 'model' ? 'assistant' : 'user',
          content: content.parts[0].text
        }));
      }
    };
  }
}

export const googleService = new GoogleService();