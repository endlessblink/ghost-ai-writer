"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Download, Copy } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface FormattedResumeProps {
  content: string
}

export function FormattedResume({ content }: FormattedResumeProps) {
  const resumeRef = React.useRef<HTMLDivElement>(null)

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
    }
  }

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      })

      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      })

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height)
      pdf.save("generated-resume.pdf")
    } catch (err) {
      console.error("Failed to generate PDF:", err)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated Resume</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
          <div 
            ref={resumeRef}
            className="prose prose-sm max-w-none space-y-4 whitespace-pre-wrap"
          >
            {content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 