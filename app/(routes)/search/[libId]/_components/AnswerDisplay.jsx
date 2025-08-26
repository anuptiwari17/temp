import React from 'react'
import { Sparkles, AlertTriangle, Globe, ExternalLink, CheckCircle2 } from 'lucide-react'

function AnswerDisplay({ aiResponse, searchResults = [], hasWebSearch = false }) {
  if (!aiResponse) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <h3 className="text-lg font-medium text-foreground">Generating your answer...</h3>
          <p className="text-sm text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    )
  }

  if (!aiResponse.success) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Generate Response</h3>
            <p className="text-sm text-muted-foreground">{aiResponse.error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Process content and convert citations to clickable links
  const processContent = (content) => {
    if (!content) return '';
    
    return content.replace(/\[(\d+)\]/g, (match, num) => {
      const sourceIndex = parseInt(num) - 1;
      if (hasWebSearch && sourceIndex < searchResults.length) {
        const source = searchResults[sourceIndex];
        return `<a href="${source.link}" target="_blank" rel="noopener noreferrer" class="citation-link" title="${source.title}">[${num}]</a>`;
      }
      return match;
    });
  };

  const renderContent = (content) => {
    if (!content) return null;

    const processedContent = processContent(content);
    const paragraphs = processedContent.split('\n\n').filter(p => p.trim());

    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      // Headings
      if (trimmed.startsWith('#')) {
        const level = (trimmed.match(/^#+/) || [''])[0].length;
        const text = trimmed.replace(/^#+\s*/, '');
        const HeadingTag = `h${Math.min(level + 2, 6)}`;
        
        return React.createElement(HeadingTag, {
          key: index,
          className: `font-semibold text-foreground mb-4 mt-6 ${
            level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : 'text-base'
          }`,
          dangerouslySetInnerHTML: { __html: text }
        });
      }

      // Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const items = trimmed.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="space-y-2 mb-6 ml-4">
            {items.map((item, itemIndex) => (
              <li 
                key={itemIndex}
                className="flex items-start gap-2 text-foreground leading-relaxed"
              >
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/^[-•]\s*/, '') }} />
              </li>
            ))}
          </ul>
        );
      }

      // Numbered lists
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').filter(item => item.trim());
        return (
          <ol key={index} className="space-y-2 mb-6 ml-4">
            {items.map((item, itemIndex) => (
              <li 
                key={itemIndex}
                className="flex items-start gap-3 text-foreground leading-relaxed"
              >
                <span className="w-6 h-6 bg-primary/10 text-primary text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {itemIndex + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, '') }} />
              </li>
            ))}
          </ol>
        );
      }

      // Regular paragraphs
      return (
        <p 
          key={index}
          className="text-foreground leading-relaxed mb-6 text-base"
          dangerouslySetInnerHTML={{ __html: trimmed }}
        />
      );
    }).filter(Boolean);
  };

  return (
    <div className="space-y-8">
      {/* Status Badge */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 border border-green-200 dark:border-green-800/50 rounded-xl">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="font-medium text-green-800 dark:text-green-200">Response Generated</span>
        </div>
        <div className="text-sm text-green-600 dark:text-green-400">
          {hasWebSearch 
            ? `Enhanced with ${searchResults.length} web sources` 
            : 'Powered by AI knowledge'
          }
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-gray max-w-none">
        <style jsx>{`
          :global(.citation-link) {
            display: inline-flex;
            align-items: center;
            color: #3b82f6;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
            padding: 2px 8px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.75rem;
            margin: 0 2px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            transition: all 0.2s ease;
          }
          :global(.citation-link:hover) {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
            border-color: rgba(59, 130, 246, 0.4);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
          }
        `}</style>
        
        <div className="space-y-4">
          {renderContent(aiResponse.content)}
        </div>
      </div>

      {/* Quick Sources (if web search enabled) */}
      {hasWebSearch && searchResults.length > 0 && (
        <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Sources Referenced</h4>
              <p className="text-xs text-muted-foreground">Information gathered from {searchResults.length} web sources</p>
            </div>
          </div>
          
          <div className="grid gap-3">
            {searchResults.slice(0, 4).map((result, index) => (
              <a
                key={index}
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-4 rounded-lg hover:bg-background/60 transition-all duration-200 border border-transparent hover:border-border/50"
              >
                <div className="w-8 h-8 bg-primary/10 text-primary text-sm font-semibold rounded-lg flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                    {result.title}
                  </h5>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                    {result.snippet}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary/70 font-medium">{result.displayLink}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary/70 transition-colors" />
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          {searchResults.length > 4 && (
            <div className="text-center mt-4 pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                View all {searchResults.length} sources in the Sources tab
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AnswerDisplay