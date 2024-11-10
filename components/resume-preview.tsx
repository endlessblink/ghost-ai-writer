"use client"

import ReactMarkdown from "react-markdown"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface ResumePreviewProps {
  content: string
  onSave: () => Promise<void>
}

export function ResumePreview({ content, onSave }: ResumePreviewProps) {
  return (
    <Card className="p-6">
      <Tabs defaultValue="preview">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>
          <Button onClick={onSave} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Resume
          </Button>
        </div>
        <TabsContent value="preview" className="mt-4">
          <div className="prose dark:prose-invert max-w-none">
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