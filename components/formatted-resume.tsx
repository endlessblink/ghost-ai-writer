"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface FormattedResumeProps {
  content: string
}

export function FormattedResume({ content }: FormattedResumeProps) {
  const resumeRef = React.useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return

    const canvas = await html2canvas(resumeRef.current)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save('resume.pdf')
  }

  // Parse the content into sections
  const sections = content.split('\n\n').map(section => {
    const [title, ...content] = section.split('\n')
    return { title, content: content.join('\n') }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Generated Resume
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => {
              navigator.clipboard.writeText(content)
            }}>
              <FileText className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={resumeRef}
          className="p-8 bg-white rounded-lg shadow-sm"
        >
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-gray-800 border-b pb-2">
                {section.title}
              </h2>
              <div className="text-gray-600 whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 