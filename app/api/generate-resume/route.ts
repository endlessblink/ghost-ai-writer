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

    // Validate required fields
    if (!data.jobListing || typeof data.jobListing !== 'string' || data.jobListing.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a detailed job listing (minimum 10 characters)" },
        { status: 400 }
      )
    }

    if (!data.existingCV || typeof data.existingCV !== 'string' || data.existingCV.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide your current CV/resume (minimum 10 characters)" },
        { status: 400 }
      )
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
        data.jobListing.trim(),
        data.qualifications?.trim(),
        data.existingCV.trim(),
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
