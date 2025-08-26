import React, { useState } from 'react'
import { Sparkles, List, Image, Globe } from 'lucide-react';
import AnswerDisplay from './AnswerDisplay';
import SourcesDisplay from './SourcesDisplay';

function DisplayResult({ searchInputRecord, aiResponse, searchResults = [] }) {
  const [activeTab, setActiveTab] = useState('Answer')
  
  const hasWebSearch = searchInputRecord?.web_search_enabled && searchResults.length > 0;
  
  const tabs = [
    { 
      id: 'Answer', 
      label: 'Answer', 
      icon: Sparkles,
      color: 'text-blue-500'
    },
    ...(hasWebSearch ? [{
      id: 'Sources', 
      label: 'Sources', 
      icon: List,
      badge: searchResults.length,
      color: 'text-green-500'
    }] : []),
    { 
      id: 'Assets', 
      label: 'Media', 
      icon: Image,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <h1 className='text-2xl md:text-3xl font-semibold text-foreground leading-tight flex-1'>
            {searchInputRecord?.searchInput}
          </h1>
          {hasWebSearch && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-700/50 rounded-full">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Live Search</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
          {tabs.map(({ id, label, icon: Icon, badge, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative
                ${activeTab === id 
                  ? 'text-foreground border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${activeTab === id ? color : ''}`} />
              <span>{label}</span>
              {badge && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full font-medium">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'Answer' && (
          <AnswerDisplay 
            aiResponse={aiResponse} 
            searchResults={searchResults}
            hasWebSearch={hasWebSearch}
          />
        )}
        
        {activeTab === 'Sources' && hasWebSearch && (
          <SourcesDisplay searchResults={searchResults} />
        )}
        
        {activeTab === 'Assets' && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Media Available</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Media content like images and videos will appear here when available for your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayResult