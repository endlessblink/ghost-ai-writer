import { NextResponse } from "next/server"
import { generateResumeWithOpenAI } from "@/lib/openai"
import { generateResumeWithAnthropic } from "@/lib/anthropic"
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

    let generatedContent: string

    try {
      if (apiType === 'openai') {
        generatedContent = await generateResumeWithOpenAI(
          data.jobListing.trim(),
          data.existingCV.trim(),
          data.qualifications?.trim(),
          apiKey
        )
      } else if (apiType === 'anthropic') {
        generatedContent = await generateResumeWithAnthropic(
          data.jobListing.trim(),
          data.existingCV.trim(),
          data.qualifications?.trim(),
          apiKey
        )
      } else {
        throw new Error("Invalid API type. Please select either OpenAI or Anthropic.")
      }

      return NextResponse.json({ content: generatedContent })
    } catch (error) {
      console.error('API error:', error instanceof Error ? error.message : error)
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
