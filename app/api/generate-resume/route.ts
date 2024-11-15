import { NextResponse } from "next/server"
import { generateResumeContent } from "@/lib/resume-generator"
import { ResumeFormData } from "@/lib/types"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log('Received request headers:', Object.fromEntries(headers()))
      
    const rawData = await request.json()
    console.log('Received request body:', rawData)
      
    // Map incoming field names to expected names
    const data = {
      jobListing: rawData.jobDescription,
      existingCV: rawData.existingResume,
      qualifications: rawData.qualifications
    } as ResumeFormData
      
    // Validate request structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: "Invalid request format - expected object" },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!data.jobListing || typeof data.jobListing !== 'string') {
      return NextResponse.json(
        { error: "Job listing is required" },
        { status: 400 }
      )
    }

    if (!data.existingCV || typeof data.existingCV !== 'string') {
      return NextResponse.json(
        { error: "Existing CV is required" },
        { status: 400 }
      )
    }

    // Trim input fields
    const trimmedJobListing = data.jobListing.trim()
    const trimmedCV = data.existingCV.trim()
    const trimmedQualifications = data.qualifications?.trim()

    const headersList = headers()
    const apiKey = headersList.get('x-api-key')
    const apiType = headersList.get('x-api-type') as 'openai' | 'anthropic'
    
    console.log('API Key present:', !!apiKey)
    console.log('API Type:', apiType)

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: "No API key provided. Please add an API key in settings." },
        { status: 401 }
      )
    }

    if (!apiType || (apiType !== 'openai' && apiType !== 'anthropic')) {
      return NextResponse.json(
        { error: "Invalid API type. Must be 'openai' or 'anthropic'." },
        { status: 400 }
      )
    }

    try {
      console.log('Starting resume generation with:', {
        jobListingLength: data.jobListing.trim().length,
        qualificationsPresent: !!data.qualifications,
        cvLength: data.existingCV.trim().length,
        apiKeyPresent: !!apiKey
      })
      
      const generatedContent = await generateResumeContent(
        trimmedJobListing,
        trimmedQualifications,
        trimmedCV,
        apiKey,
        apiType
      )
      
      console.log('Resume generation successful, content length:', generatedContent.length)
      return NextResponse.json({ content: generatedContent })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('API error:', errorMessage)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to generate resume" },
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
