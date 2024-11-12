"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { generatePDF, previewPDF } from "@/lib/pdf-utils"

interface FormattedResumeProps {
  content: string
}

export function FormattedResume({ content }: FormattedResumeProps) {
  const formattedContent = React.useMemo(() => {
    const lines = content.split('\n')
    let html = ''
    let inList = false

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('# ')) {
        // Name
        html += `<h1>${trimmedLine.slice(2)}</h1>`
      } else if (trimmedLine.startsWith('## ')) {
        // Section headers
        if (inList) {
          html += '</ul>'
          inList = false
        }
        html += `<h2>${trimmedLine.slice(3)}</h2>`
      } else if (trimmedLine.startsWith('#### ')) {
        // Job headers
        if (inList) {
          html += '</ul>'
          inList = false
        }
        const parts = trimmedLine.slice(5).split('|')
        if (parts.length >= 2) {
          html += `
            <div class="job-header">${parts[0].trim()}</div>
            <div class="job-subheader">${parts[1].trim()}${parts[2] ? ` | ${parts[2].trim()}` : ''}</div>
          `
        } else {
          html += `<div class="job-header">${trimmedLine.slice(5)}</div>`
        }
      } else if (trimmedLine.startsWith('- ')) {
        // List items
        if (!inList) {
          html += '<ul>'
          inList = true
        }
        html += `<li>${trimmedLine.slice(2)}</li>`
      } else if (trimmedLine.includes('•')) {
        // Contact info
        html += `<div class="contact-info">${trimmedLine}</div>`
      } else if (trimmedLine !== '') {
        // Regular paragraphs
        if (inList) {
          html += '</ul>'
          inList = false
        }
        html += `<p>${trimmedLine}</p>`
      }
    })

    if (inList) html += '</ul>'
    return html
  }, [content])

  const handleDownload = async () => {
    try {
      await generatePDF('resume-content', 'resume.pdf')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  }

  const handlePreview = async () => {
    try {
      await previewPDF('resume-content')
    } catch (error) {
      console.error('Failed to preview PDF:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Formatted Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          id="resume-content" 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
        <div className="flex space-x-4 mt-4">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 