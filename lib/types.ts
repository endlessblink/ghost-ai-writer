export interface ResumeFormData {
  jobListing: string
  existingCV: string
  qualifications?: string
}

export interface GeneratedResume {
  content: string
  createdAt: Date
}

export interface ResumeError {
  message: string
  code?: string
}
