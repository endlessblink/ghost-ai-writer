"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormattedResume } from "@/components/formatted-resume"
import { generateResume } from "@/app/actions"
import { ResumeForm } from "@/components/resume-form"
import type { ResumeFormData, GeneratedResume, ResumeError } from "@/lib/types"

export function ResumeBuilder() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedResume, setGeneratedResume] = React.useState<GeneratedResume | null>(null)
  const [error, setError] = React.useState<ResumeError | null>(null)

  const handleSubmit = async (data: ResumeFormData) => {
    const openaiKey = sessionStorage.getItem("openai_api_key")
    const anthropicKey = sessionStorage.getItem("anthropic_api_key")
    
    if (!openaiKey && !anthropicKey) {
      setError({ message: "Please add an API key in settings" })
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const apiKey = anthropicKey || openaiKey || ""
      const apiType = anthropicKey ? "anthropic" : "openai"

      const content = await generateResume(
        data.jobListing,
        data.qualifications,
        data.existingCV,
        apiKey,
        apiType
      )
      
      setGeneratedResume({
        content,
        createdAt: new Date()
      })
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Failed to generate resume. Please try again.",
        code: "GENERATION_ERROR"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ResumeForm 
        onSubmit={handleSubmit}
        isGenerating={isGenerating}
        error={error?.message}
      />

      {generatedResume && (
        <FormattedResume content={generatedResume.content} />
      )}
    </div>
  )
}