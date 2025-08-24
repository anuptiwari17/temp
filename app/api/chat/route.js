// /app/api/chat/route.js
import { NextResponse } from 'next/server';

// OpenRouter API Handler
async function callOpenRouter(modelConfig, messages, options) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Study Agent'
    },
    body: JSON.stringify({
      model: modelConfig.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
    })
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
}

// Google API Handler
async function callGoogle(modelConfig, messages, options) {
  // Convert OpenAI format to Gemini format
  const contents = [];
  let systemContext = '';
  
  for (const message of messages) {
    if (message.role === 'system') {
      systemContext = message.content + '\n\n';
      continue;
    }
    contents.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }]
    });
  }

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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.NEXT_PUBLIC_GOOGLE_API_KEY
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
}

// NVIDIA API Handler
async function callNvidia(modelConfig, messages, options) {
  const requestBody = {
    model: modelConfig.model,
    messages: messages,
    temperature: options.temperature || 0.7,
    top_p: options.topP || 1,
    max_tokens: options.maxTokens || 2000,
    frequency_penalty: options.frequencyPenalty || 0,
    presence_penalty: options.presencePenalty || 0,
  };

  // Add reasoning support if enabled
  if (options.enableReasoning) {
    requestBody.extra_body = {
      min_thinking_tokens: options.minThinkingTokens || 1000,
      max_thinking_tokens: options.maxThinkingTokens || 10000
    };
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NVIDIA_API_KEY}`,
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
    reasoning: reasoning,
    usage: data.usage,
    model: data.model
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { modelConfig, messages, options = {} } = body;

    if (!modelConfig || !messages) {
      return NextResponse.json(
        { success: false, error: 'Missing modelConfig or messages' },
        { status: 400 }
      );
    }

    let response;

    // Route to appropriate service based on API type
    switch (modelConfig.apiType) {
      case 'openrouter':
        response = await callOpenRouter(modelConfig, messages, options);
        break;
      case 'google':
        response = await callGoogle(modelConfig, messages, options);
        break;
      case 'nvidia':
        response = await callNvidia(modelConfig, messages, options);
        break;
      default:
        throw new Error(`Unsupported API type: ${modelConfig.apiType}`);
    }

    return NextResponse.json({
      ...response,
      modelUsed: modelConfig,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        content: null
      },
      { status: 500 }
    );
  }
}