"use client"

import { useForm } from "react-hook-form"
import { Loader2, FileText, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ResumeFormData } from "@/lib/types"
import { sampleJobListing, sampleQualifications, sampleCV } from "@/lib/sample-data"

interface ResumeFormProps {
  onSubmit: (data: ResumeFormData) => Promise<void>
  isGenerating: boolean
  testMode?: boolean
  error?: string
}

export function ResumeForm({ onSubmit, isGenerating, testMode, error }: ResumeFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResumeFormData>()

  const loadSampleData = () => {
    setValue("jobListing", sampleJobListing)
    setValue("qualifications", sampleQualifications)
    setValue("existingCV", sampleCV)
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
                required: "Job listing is required",
                minLength: { value: 10, message: "Job listing is too short" }
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
            <Textarea
              placeholder="Paste your current CV/resume here..."
              className="min-h-[150px]"
              {...register("existingCV", { 
                required: "Existing CV is required",
                minLength: { value: 10, message: "CV content is too short" }
              })}
            />
            {errors.existingCV && (
              <p className="text-red-500 text-sm mt-1">
                {errors.existingCV.message || "CV must be at least 10 characters"}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          {error && (
            <div className="mb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Resume...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Resume
              </>
            )}
          </Button>
        </div>
      </Card>
    </form>
  )
}
