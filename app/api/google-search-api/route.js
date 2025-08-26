// app/api/google-search-api/route.js
import { NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

export async function POST(request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
      return NextResponse.json(
        { success: false, error: 'Google Search API credentials not configured' },
        { status: 500 }
      );
    }

    // Building the Google Custom Search API URL
    const searchUrl = new URL('https://www.googleapis.com/customsearch/v1');
    searchUrl.searchParams.set('key', GOOGLE_API_KEY);
    searchUrl.searchParams.set('cx', SEARCH_ENGINE_ID);
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('num', '10'); // Number of results
    searchUrl.searchParams.set('safe', 'active'); // Safe search
    searchUrl.searchParams.set('fields', 'items(title,link,snippet,displayLink,formattedUrl),searchInformation(totalResults,searchTime)');

    console.log('Searching Google for:', query);

    const response = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Search API Error:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.error?.message || 'Search request failed' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Process and clean the search results
    const processedResults = (data.items || []).map((item, index) => ({
      id: index + 1,
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
      formattedUrl: item.formattedUrl,
    }));

    const searchInfo = {
      totalResults: data.searchInformation?.totalResults || '0',
      searchTime: data.searchInformation?.searchTime || '0',
      resultsCount: processedResults.length
    };

    console.log(`Found ${processedResults.length} results for: ${query}`);

    return NextResponse.json({
      success: true,
      query: query,
      results: processedResults,
      searchInfo: searchInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Google Search API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        results: []
      },
      { status: 500 }
    );
  }
}