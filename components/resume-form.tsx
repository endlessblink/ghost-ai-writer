"use client"

import { useForm } from "react-hook-form"
import { Loader2, FileText, Wand2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ResumeFormData } from "@/lib/types"
import { sampleJobListing, sampleQualifications, sampleCV } from "@/lib/sample-data"
import { extractTextFromPDF } from "@/lib/pdf-utils"
import { useState } from "react"

interface ResumeFormProps {
  onSubmit: (data: ResumeFormData) => Promise<void>
  isGenerating: boolean
  testMode?: boolean
  error?: string
}

export function ResumeForm({ onSubmit, isGenerating, testMode, error }: ResumeFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResumeFormData>()
  const [uploadedPDF, setUploadedPDF] = useState<string | null>(null)

  const loadSampleData = () => {
    setValue("jobListing", sampleJobListing)
    setValue("qualifications", sampleQualifications)
    setValue("existingCV", sampleCV)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    try {
      const text = await extractTextFromPDF(file)
      setValue("existingCV", text)
      setUploadedPDF(file.name)
    } catch (error) {
      console.error('Error extracting text from PDF:', error)
      alert('Failed to read PDF file. Please try pasting the text directly.')
    }
  }

  const clearUploadedPDF = () => {
    setUploadedPDF(null)
    setValue("existingCV", "")
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          {testMode && (
            <div className="mb-6">
              <Button
                type="button"
                variant="secondary"
                onClick={loadSampleData}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Load Sample Data
              </Button>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Job Listing
            </label>
            <Textarea
              placeholder="Paste the job listing here..."
              className="min-h-[150px]"
              {...register("jobListing", { 
                required: true
              })}
            />
            {errors.jobListing && (
              <p className="text-red-500 text-sm mt-1">
                {errors.jobListing.message || "Job listing must be at least 10 characters"}
              </p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              Your Qualifications
              <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              placeholder="List your relevant qualifications, skills, and experience..."
              className="min-h-[150px]"
              {...register("qualifications")}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Existing CV/Resume
            </label>
            <div className="space-y-2">
              <Textarea
                placeholder="Paste your current CV/resume here..."
                className="min-h-[150px]"
                {...register("existingCV", { 
                  required: true
                })}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">or</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {uploadedPDF && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {uploadedPDF}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearUploadedPDF}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear PDF</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {errors.existingCV && (
                <p className="text-red-500 text-sm">
                  {errors.existingCV.message || "CV must be at least 10 characters"}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          {error && (
            <div className="mb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <Button 
            type="submit" 
            disabled={isGenerating} 
            className={`px-8 transition-all duration-300 hover:scale-105 hover:bg-primary/90`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Resume...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4 animate-bounce-subtle" />
                Generate Resume
              </>
            )}
          </Button>
        </div>
      </Card>
    </form>
  )
}
