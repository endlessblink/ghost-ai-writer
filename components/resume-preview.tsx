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
    if (previewRef.current && previewRef.current.id) {
      await generatePDF(previewRef.current.id)
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
            <Button onClick={onSave} size="sm" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleDownloadPDF} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        <TabsContent value="preview" className="mt-0">
          <div ref={previewRef} id="resume-preview" className="prose prose-sm dark:prose-invert max-w-none">
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
