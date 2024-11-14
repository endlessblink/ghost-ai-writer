"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Loader2, Wand2 } from "lucide-react"
import type { ResumeFormData, GeneratedResume, ResumeError } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormattedResume } from "@/components/formatted-resume"
import { generateResume } from "@/app/actions"

export function ResumeBuilder() {
  const [formData, setFormData] = React.useState<ResumeFormData>({
    jobDescription: "",
    existingResume: "",
    qualifications: ""
  })
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedResume, setGeneratedResume] = React.useState<GeneratedResume | null>(null)
  const [error, setError] = React.useState<ResumeError | null>(null)

  const handleInputChange = (
    field: keyof ResumeFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleGenerate = async () => {
    if (!formData.jobDescription || !formData.existingResume) {
      setError({ message: "Please fill in both job description and your current resume" })
      return
    }

    const openaiKey = localStorage.getItem("openai_api_key")
    const anthropicKey = localStorage.getItem("anthropic_api_key")
    
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
        formData.jobDescription,
        formData.qualifications,
        formData.existingResume,
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
      <Card>
        <CardHeader>
          <CardTitle>Build Your Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea
              placeholder="Paste the job description here..."
              value={formData.jobDescription}
              onChange={(e) => handleInputChange("jobDescription", e.target.value)}
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Current Resume</label>
            <Textarea
              placeholder="Paste your current resume or relevant experience..."
              value={formData.existingResume}
              onChange={(e) => handleInputChange("existingResume", e.target.value)}
              className="h-48"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Qualifications (Optional)</label>
            <Textarea
              placeholder="Add any additional qualifications or notes..."
              value={formData.qualifications}
              onChange={(e) => handleInputChange("qualifications", e.target.value)}
              className="h-24"
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !formData.jobDescription || !formData.existingResume}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedResume && (
        <FormattedResume content={generatedResume.content} />
      )}
    </div>
  )
}