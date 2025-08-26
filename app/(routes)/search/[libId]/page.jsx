'use client'
import React, { useContext, useEffect, useState } from 'react'
import supabase from '@/services/supabase'
import { UserDetailContext } from '@/app/context/UserDetailContext'
import Header from './_components/Header'
import DisplayResult from './_components/DisplayResult'
import { aiService } from '@/services/aiService'
import { getModelById } from '@/services/aiModels'
import { AlertCircle, Loader2 } from 'lucide-react'

function SearchPage({ params }) {
  const { userDetail } = useContext(UserDetailContext)
  const [searchInputRecord, setSearchInputRecord] = useState(null)
  const [aiResponse, setAiResponse] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingStep, setProcessingStep] = useState('')

  const libId = params.libId

  useEffect(() => {
    if (userDetail?.email && libId) {
      fetchSearchInput()
    } else if (!userDetail?.email) {
      setError('Please sign in to view this search')
      setLoading(false)
    }
  }, [userDetail, libId])

  const fetchSearchInput = async () => {
    try {
      setLoading(true)
      setProcessingStep('Loading search record...')
      
      // Fetch the library record
      const { data: libraryData, error: libraryError } = await supabase
        .from('Library')
        .select('*')
        .eq('libId', libId)
        .eq('userEmail', userDetail.email)
        .single()

      if (libraryError) {
        console.error('Library fetch error:', libraryError)
        throw new Error('Search record not found or access denied')
      }

      if (!libraryData) {
        throw new Error('No search record found')
      }

      console.log('Library data fetched:', libraryData)
      setSearchInputRecord(libraryData)

      // Generate AI response based on whether web search is enabled
      if (libraryData.web_search_enabled) {
        await handleWebSearchQuery(libraryData)
      } else {
        await handleRegularQuery(libraryData)
      }
    } catch (err) {
      console.error('Error in fetchSearchInput:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      setProcessingStep('')
    }
  }

  const handleWebSearchQuery = async (libraryData) => {
    try {
      setProcessingStep('Searching the web...')
      
      // First, perform web search
      const searchResponse = await fetch('/api/google-search-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: libraryData.searchInput
        })
      })

      if (!searchResponse.ok) {
        throw new Error(`Search API error: ${searchResponse.status}`)
      }

      const searchData = await searchResponse.json()
      console.log('Search results:', searchData)
      
      if (!searchData.success) {
        throw new Error(searchData.error || 'Web search failed')
      }

      setSearchResults(searchData.results || [])
      setProcessingStep('Generating AI response with search context...')

      // Generate AI response with search context
      const systemPrompt = aiService.getSystemPromptWithSearch(libraryData.type, searchData.results)
      
      const response = await aiService.generateResponse(
        'best', // Default model - you can make this configurable
        libraryData.searchInput,
        [],
        {
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 2000
        }
      )

      console.log('AI Response with search:', response)
      setAiResponse(response)
    } catch (err) {
      console.error('Error in handleWebSearchQuery:', err)
      throw err
    }
  }

  const handleRegularQuery = async (libraryData) => {
    try {
      setProcessingStep('Generating AI response...')
      
      // Generate AI response without web search
      const systemPrompt = aiService.getSystemPrompt(libraryData.type)
      
      const response = await aiService.generateResponse(
        'best', // Default model - you can make this configurable
        libraryData.searchInput,
        [],
        {
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 2000
        }
      )

      console.log('AI Response without search:', response)
      setAiResponse(response)
    } catch (err) {
      console.error('Error in handleRegularQuery:', err)
      throw err
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {processingStep || 'Loading...'}
            </h2>
            <p className="text-muted-foreground text-sm">
              Please wait while we prepare your response
            </p>
          </div>

          {/* Progress steps */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className={`flex items-center gap-2 ${
              processingStep.includes('Loading') ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading search record
            </div>
            {searchInputRecord?.web_search_enabled && (
              <div className={`flex items-center gap-2 ${
                processingStep.includes('Searching') ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching the web
              </div>
            )}
            <div className={`flex items-center gap-2 ${
              processingStep.includes('Generating') ? 'text-primary' : 'text-muted-foreground'
            }`}>
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating AI response
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm">
              {error}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setError(null)
                fetchSearchInput()
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main content
  if (!searchInputRecord) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">No Data Found</h2>
            <p className="text-muted-foreground text-sm">
              The search record could not be loaded
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <Header searchInputRecord={searchInputRecord} />
        <div className="px-4 md:px-6">
          <DisplayResult 
            searchInputRecord={searchInputRecord} 
            aiResponse={aiResponse}
            searchResults={searchResults}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchPage;