"use client";
import { useState } from 'react';
import { aiService } from '../services/aiService';
import { getAllCustomModels } from '../services/aiModels';

export default function TestPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("What is 2+2?");

  const models = getAllCustomModels();

  const testModel = async (modelId) => {
    setLoading(prev => ({ ...prev, [modelId]: true }));
    
    try {
      const response = await aiService.generateResponse(
        modelId,
        testMessage,
        [],
        { maxTokens: 100 }
      );
      
      setResults(prev => ({
        ...prev,
        [modelId]: response
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [modelId]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [modelId]: false }));
    }
  };

  const testAllConnections = async () => {
    setLoading({ all: true });
    const connectionResults = await aiService.testConnections();
    setResults(prev => ({ ...prev, connections: connectionResults }));
    setLoading({ all: false });
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">AI Services Test Page</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Test Message:</label>
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter test message..."
        />
      </div>

      <div className="mb-6">
        <button
          onClick={testAllConnections}
          disabled={loading.all}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading.all ? 'Testing Connections...' : 'Test All Connections'}
        </button>
        
        {results.connections && (
          <div className="mt-2 p-3 bg-gray-100 rounded-md">
            <h3 className="font-semibold">Connection Test Results:</h3>
            {Object.entries(results.connections).map(([service, status]) => (
              <div key={service} className={`text-sm ${status ? 'text-green-600' : 'text-red-600'}`}>
                {service}: {status ? '✅ Working' : '❌ Failed'}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {models.map((model) => (
          <div key={model.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold">{model.name}</h3>
                <p className="text-sm text-gray-600">{model.desc} • {model.provider}</p>
              </div>
              <button
                onClick={() => testModel(model.id)}
                disabled={loading[model.id]}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:opacity-50 text-sm"
              >
                {loading[model.id] ? 'Testing...' : 'Test Model'}
              </button>
            </div>
            
            {results[model.id] && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                {results[model.id].success ? (
                  <div>
                    <div className="text-green-600 text-sm font-medium mb-1">✅ Success</div>
                    <div className="text-sm">{results[model.id].content}</div>
                    {results[model.id].reasoning && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                        <strong>Reasoning:</strong> {results[model.id].reasoning}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-red-600 text-sm font-medium mb-1">❌ Failed</div>
                    <div className="text-sm text-red-600">{results[model.id].error}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}