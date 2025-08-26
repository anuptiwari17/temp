import React from 'react'
import { ExternalLink, Globe, Clock, Star } from 'lucide-react'

function SourcesDisplay({ searchResults = [] }) {
  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Sources Found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No web sources were found for this search. Try enabling web search for more comprehensive results.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Web Sources</h3>
            <p className="text-sm text-muted-foreground">
              {searchResults.length} sources found from across the web
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Live results</span>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid gap-4">
        {searchResults.map((result, index) => (
          <div
            key={index}
            className="group relative bg-card border border-border/50 rounded-xl p-6 hover:border-border transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              {/* Source Number */}
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 text-primary font-bold rounded-xl flex items-center justify-center text-sm">
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Title */}
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group-hover:text-primary transition-colors"
                >
                  <h4 className="font-semibold text-foreground line-clamp-2 leading-snug">
                    {result.title}
                  </h4>
                </a>

                {/* Snippet */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {result.snippet}
                </p>

                {/* URL and Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-muted/50 rounded-md flex items-center justify-center">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {result.displayLink}
                    </span>
                  </div>
                  
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg transition-all duration-200"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-border/30">
        <div className="flex items-start gap-3">
          <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Source Quality Note</p>
            <p className="text-muted-foreground leading-relaxed">
              These sources are automatically gathered from web search results. While we strive for accuracy, 
              please verify important information from the original sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SourcesDisplay