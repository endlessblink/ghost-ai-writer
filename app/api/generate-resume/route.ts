import { headers } from 'next/headers'
import { generateResumeContent } from '@/lib/resume-generator'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Get headers first
    const headersList = await headers()
    const apiKey = headersList.get('x-api-key')
    const apiType = headersList.get('x-api-type') as 'openai' | 'anthropic'

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      )
    }

    // Get and validate request body
    const rawData = await request.json()
    const { jobDescription, existingResume, qualifications } = rawData

    if (!jobDescription || !existingResume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Clean and validate inputs
    const trimmedJobListing = jobDescription.trim()
    const trimmedCV = existingResume.trim()
    const trimmedQualifications = qualifications?.trim()

    // Clean API key - remove any quotes or whitespace
    const cleanApiKey = apiKey.replace(/["'\s]+/g, '').trim()

    // Validate API key format
    if (apiType === 'anthropic' && !cleanApiKey.startsWith('sk-ant-api03-')) {
      return NextResponse.json(
        { error: "Invalid Anthropic API key format. Key should start with 'sk-ant-api03-'" },
        { status: 401 }
      )
    }

    console.log('Starting resume generation with:', {
      jobListingLength: trimmedJobListing.length,
      qualificationsPresent: !!trimmedQualifications,
      cvLength: trimmedCV.length,
      apiKeyPresent: !!cleanApiKey,
      apiType
    })

    try {
      const generatedContent = await generateResumeContent(
        trimmedJobListing,
        trimmedQualifications,
        trimmedCV,
        cleanApiKey,
        apiType
      )

      return NextResponse.json({ content: generatedContent })
    } catch (error) {
      console.error('Resume generation error:', error)
      
      // Handle API-specific errors
      if (error instanceof Error) {
        const message = error.message.toLowerCase()
        
        // Authentication errors
        if (message.includes('invalid') && message.includes('api key')) {
          return NextResponse.json(
            { error: "Invalid API key. Please check your settings and make sure you've entered the correct key." },
            { status: 401 }
          )
        }
        
        // Rate limiting
        if (message.includes('rate limit')) {
          return NextResponse.json(
            { error: "Rate limit reached. Please try again in a moment." },
            { status: 429 }
          )
        }
        
        // Quota exceeded
        if (message.includes('quota') || message.includes('billing')) {
          return NextResponse.json(
            { error: "API quota exceeded. Please check your billing settings." },
            { status: 402 }
          )
        }
        
        // Other API errors
        if (message.includes('api error')) {
          return NextResponse.json(
            { error: error.message },
            { status: 500 }
          )
        }
      }
      
      // Generic error fallback
      return NextResponse.json(
        { error: "Failed to generate resume. Please try again." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    )
  }
}
