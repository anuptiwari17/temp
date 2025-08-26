import { Clock, Share, Link2, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'

function Header({ searchInputRecord }) {
  const [copied, setCopied] = useState(false)

  const createdAt = searchInputRecord?.created_at
  let timeAgo = 'Unknown time'

  if (createdAt) {
    try {
      const parsedDate = parseISO(createdAt)
      timeAgo = formatDistanceToNowStrict(parsedDate, { addSuffix: true })
    } catch (err) {
      console.error('Invalid date format:', err)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: searchInputRecord?.searchInput || 'Search Result',
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err)
          handleCopyLink()
        }
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className='sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50'>
      <div className='max-w-4xl mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Time Info */}
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg'>
              <Clock className='w-4 h-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground font-medium'>{timeAgo}</span>
            </div>
            
            {searchInputRecord?.web_search_enabled && (
              <div className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-md'>
                Web Enhanced
              </div>
            )}
          </div>

          {/*query preview - Hidden on mobile */}
          <div className='hidden md:block flex-1 mx-6'>
            <p className='text-sm text-muted-foreground text-center line-clamp-1 max-w-md mx-auto'>
              {searchInputRecord?.searchInput}
            </p>
          </div>

          {/*actions */}
          <div className='flex items-center gap-2'>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 px-3 hover:bg-muted/80"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 px-3 hover:bg-muted/80"
            >
              <Share className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header