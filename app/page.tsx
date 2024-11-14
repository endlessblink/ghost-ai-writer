"use client"

import { ResumeBuilder } from "@/components/resume-builder"
import { SettingsDialog } from "@/components/settings-dialog"
import { useState, useEffect } from 'react'
import { Terminal, Sparkles } from 'lucide-react'

export default function Home() {
  const [apiType, setApiType] = useState<'anthropic' | 'openai'>('anthropic')
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  // Load saved API settings on mount
  useEffect(() => {
    const savedApiType = localStorage.getItem('apiType') || 'anthropic'
    const savedApiKey = localStorage.getItem('apiKey') || ''
    const savedShowSettings = localStorage.getItem('showSettings') === 'true'
    
    setApiType(savedApiType as 'anthropic' | 'openai')
    setApiKey(savedApiKey)
    setShowSettings(savedShowSettings)
  }, [])

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('apiType', apiType)
    localStorage.setItem('apiKey', apiKey)
    localStorage.setItem('showSettings', showSettings.toString())
  }, [apiType, apiKey, showSettings])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex flex-col space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal className="h-10 w-10 text-primary" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                CV in the Shell
              </h1>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
            >
              Settings
            </button>
          </div>
          <div className="relative max-w-3xl">
            <div className="absolute -left-4 top-1/2 w-1 h-16 bg-gradient-to-b from-primary/60 to-transparent transform -translate-y-1/2" />
            <p className="text-lg text-muted-foreground leading-relaxed pl-4">
              Transform your resume with AI-powered optimization. Simply paste your current resume and the job description, 
              and our AI will tailor your resume to highlight relevant skills and experiences. The tool uses advanced language 
              models to create <span className="text-primary font-medium">ATS-friendly resumes</span> while maintaining your 
              authentic professional narrative.
            </p>
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
              <Sparkles className="h-5 w-5 text-primary/40" />
            </div>
          </div>
        </div>
        <ResumeBuilder apiType={apiType} apiKey={apiKey} />
        <SettingsDialog 
          open={showSettings} 
          onOpenChange={setShowSettings}
          apiType={apiType}
          setApiType={setApiType}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
      </div>
    </main>
  )
}