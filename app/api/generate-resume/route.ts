import { NextResponse } from "next/server"
import { generateResumeContent } from "@/lib/resume-generator"
import { ResumeFormData } from "@/lib/types"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const data = await request.json() as ResumeFormData
    
    // Validate required fields
    if (!data.jobListing || data.jobListing.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a detailed job listing (minimum 10 characters)" },
        { status: 400 }
      )
    }

    if (!data.existingCV || data.existingCV.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide your current CV/resume (minimum 10 characters)" },
        { status: 400 }
      )
    }

    const headersList = await headers()
    const apiKey = headersList.get('x-api-key')
    const apiType = headersList.get('x-api-type')

    if (!apiKey) {
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
