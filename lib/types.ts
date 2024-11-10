export interface ResumeFormData {
  jobDescription: string
  existingResume: string
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