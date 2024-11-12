import { NextResponse } from "next/server"
import { generateResumeContent } from "@/lib/resume-generator"
import { ResumeFormData } from "@/lib/types"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log('Received request headers:', Object.fromEntries(headers()))
      
    const rawData = await request.json()
    console.log('Received request body:', rawData)
      
    const data = rawData as ResumeFormData
      
    // Validate request structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: "Invalid request format - expected object" },
        { status: 400 }
      )
    }

    // Validate and trim input fields
    const trimmedJobListing = data.jobListing?.trim() || ''
    const trimmedCV = data.existingCV?.trim() || ''
    const trimmedQualifications = data.qualifications?.trim()

    console.log('Validated input lengths:', {
      jobListing: trimmedJobListing.length,
      cv: trimmedCV.length,
      qualifications: trimmedQualifications?.length
    })

    // Validate required fields with specific error messages
    if (trimmedJobListing.length < 10) {
      const error = "Job listing must be at least 10 characters long. Current length: " + trimmedJobListing.length
      console.log('Validation failed:', error)
      return NextResponse.json({ error }, { status: 400 })
    }

    if (trimmedCV.length < 10) {
      const error = "CV must be at least 10 characters long. Current length: " + trimmedCV.length
      console.log('Validation failed:', error)
      return NextResponse.json({ error }, { status: 400 })
    }

    const headersList = headers()
    const apiKey = headersList.get('x-api-key')
    
    console.log('API Key present:', !!apiKey)

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: "No API key provided. Please add an API key in settings." },
        { status: 401 }
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
        apiKey
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
