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
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenAISwitch = (checked: boolean) => {
    if (checked) {
      setUseOpenAI(true)
      setUseAnthropic(false)
      setAnthropicKey("")
    } else {
      setUseOpenAI(false)
      setOpenAIKey("")
    }
  }

  const handleAnthropicSwitch = (checked: boolean) => {
    if (checked) {
      setUseAnthropic(true)
      setUseOpenAI(false)
      setOpenAIKey("")
    } else {
      setUseAnthropic(false)
      setAnthropicKey("")
    }
  }

  const handleSaveKeys = () => {
    sessionStorage.removeItem("openai_api_key")
    sessionStorage.removeItem("anthropic_api_key")
    
    if (useOpenAI && openAIKey) {
      sessionStorage.setItem("openai_api_key", openAIKey)
    }
    if (useAnthropic && anthropicKey) {
      sessionStorage.setItem("anthropic_api_key", anthropicKey)
    }
    setIsOpen(false)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      const savedOpenAIKey = sessionStorage.getItem("openai_api_key")
      const savedAnthropicKey = sessionStorage.getItem("anthropic_api_key")
      
      setOpenAIKey("")
      setAnthropicKey("")
      setUseOpenAI(false)
      setUseAnthropic(false)
      
      if (savedAnthropicKey) {
        setAnthropicKey(savedAnthropicKey)
        setUseAnthropic(true)
      } else if (savedOpenAIKey) {
        setOpenAIKey(savedOpenAIKey)
        setUseOpenAI(true)
      } else {
        setUseOpenAI(true)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
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
                onCheckedChange={handleOpenAISwitch}
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
                onCheckedChange={handleAnthropicSwitch}
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