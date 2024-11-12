"use client"

import ReactMarkdown from "react-markdown"
import { Save, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { generatePDF } from "@/lib/pdf-utils"
import { useRef } from "react"

interface ResumePreviewProps {
  content: string
  onSave: () => Promise<void>
}

export function ResumePreview({ content, onSave }: ResumePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (previewRef.current) {
      await generatePDF(previewRef.current)
    }
  }
  return (
    <Card className="p-6">
      <Tabs defaultValue="preview">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={onSave} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Resume
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        <TabsContent value="preview" className="mt-4">
          <div ref={previewRef} className="prose dark:prose-invert max-w-[21cm] mx-auto bg-white p-8 rounded-lg shadow-sm print:shadow-none" style={{ minHeight: '29.7cm' }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </TabsContent>
        <TabsContent value="markdown" className="mt-4">
          <Textarea
            value={content}
            readOnly
            className="min-h-[500px] font-mono text-sm"
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
