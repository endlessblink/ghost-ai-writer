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
import { PDFUpload } from "./pdf-upload"

interface ResumeBuilderProps {
  apiType: 'anthropic' | 'openai'
  apiKey: string
}

export function ResumeBuilder({ apiType, apiKey }: ResumeBuilderProps) {
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

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "x-api-type": apiType,
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to generate resume")
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setGeneratedResume({
        content: data.content,
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
            <div className="space-y-2">
              <PDFUpload 
                onTextExtracted={(text) => handleInputChange("existingResume", text)} 
                className="mb-2"
              />
              <div className="relative">
                <Textarea
                  value={formData.existingResume}
                  onChange={(e) => handleInputChange("existingResume", e.target.value)}
                  className="h-48"
                  placeholder="Paste your current resume here or upload a PDF"
                />
              </div>
            </div>
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

          <div className="flex gap-4">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !formData.jobDescription || !formData.existingResume}
              className="flex-1"
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
            <Button 
              onClick={() => {
                setFormData({
                  jobDescription: "",
                  existingResume: "",
                  qualifications: ""
                });
                setGeneratedResume(null);
                setError(null);
              }}
              variant="outline"
              className="px-8"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedResume && (
        <FormattedResume content={generatedResume.content} />
      )}
    </div>
  )
}