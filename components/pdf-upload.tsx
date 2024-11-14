'use client'

import { useState, useEffect } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { Button } from './ui/button'

interface PDFUploadProps {
  onTextExtracted: (text: string) => void
  className?: string
}

export function PDFUpload({ onTextExtracted, className = '' }: PDFUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload a file smaller than 5MB')
      return
    }

    // Check file type
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      alert('Please upload a PDF or TXT file')
      return
    }

    setIsLoading(true)
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer()
        const data = new Uint8Array(arrayBuffer)
        const pdfParse = (await import('pdf-parse/lib/pdf-parse')).default
        const result = await pdfParse(data)
        const cleanText = result.text.replace(/\s+/g, ' ').trim()
        onTextExtracted(cleanText)
      } else {
        // Handle text files
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result
          if (typeof text === 'string') {
            const cleanText = text.replace(/\s+/g, ' ').trim()
            onTextExtracted(cleanText)
          }
        }
        reader.readAsText(file)
      }
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing file. Please try again with a different file or paste the text manually.')
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  // Don't render until after hydration
  if (!isClient) {
    return null
  }

  return (
    <div className={`${className} min-h-[96px]`}>
      <Button
        variant="outline"
        className="group w-full h-24 flex flex-col items-center justify-center space-y-2 relative border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-xl"
        disabled={isLoading}
      >
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-label="Upload Resume"
        />
        <div className="pointer-events-none flex flex-col items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Processing your document...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <div className="flex flex-col items-center">
                <span className="font-semibold text-base">Upload Resume</span>
                <span className="text-sm text-muted-foreground mt-0.5">(PDF or TXT, max 5MB)</span>
              </div>
            </>
          )}
        </div>
      </Button>
    </div>
  )
}
