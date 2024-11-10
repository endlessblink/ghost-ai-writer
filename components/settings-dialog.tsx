"use client"

import * as React from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SettingsDialog() {
  const [openAIKey, setOpenAIKey] = React.useState("")
  const [anthropicKey, setAnthropicKey] = React.useState("")
  const [useOpenAI, setUseOpenAI] = React.useState(true)
  const [useAnthropic, setUseAnthropic] = React.useState(false)

  const handleSaveKeys = () => {
    if (useOpenAI) {
      localStorage.setItem("openai_api_key", openAIKey)
    } else {
      localStorage.removeItem("openai_api_key")
    }
    
    if (useAnthropic) {
      localStorage.setItem("anthropic_api_key", anthropicKey)
    } else {
      localStorage.removeItem("anthropic_api_key")
    }
  }

  React.useEffect(() => {
    const savedOpenAIKey = localStorage.getItem("openai_api_key")
    const savedAnthropicKey = localStorage.getItem("anthropic_api_key")
    
    if (savedOpenAIKey) {
      setOpenAIKey(savedOpenAIKey)
      setUseOpenAI(true)
    }
    
    if (savedAnthropicKey) {
      setAnthropicKey(savedAnthropicKey)
      setUseAnthropic(true)
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys for the resume builder.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* OpenAI Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai">OpenAI API</Label>
              <Switch
                id="openai"
                checked={useOpenAI}
                onCheckedChange={setUseOpenAI}
              />
            </div>
            {useOpenAI && (
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                />
              </div>
            )}
          </div>

          {/* Anthropic Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="anthropic">Anthropic API</Label>
              <Switch
                id="anthropic"
                checked={useAnthropic}
                onCheckedChange={setUseAnthropic}
              />
            </div>
            {useAnthropic && (
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                <Input
                  id="anthropic-key"
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="Enter your Anthropic API key"
                />
              </div>
            )}
          </div>

          <Button onClick={handleSaveKeys} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}