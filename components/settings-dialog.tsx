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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiType: 'anthropic' | 'openai'
  setApiType: (type: 'anthropic' | 'openai') => void
  apiKey: string
  setApiKey: (key: string) => void
}

export function SettingsDialog({ 
  open, 
  onOpenChange,
  apiType,
  setApiType,
  apiKey,
  setApiKey
}: SettingsDialogProps) {
  const { toast } = useToast()

  const handleSaveKeys = () => {
    localStorage.setItem("api_type", apiType)
    localStorage.setItem("api_key", apiKey)
    
    // Show success message and close dialog
    toast({
      title: "Settings saved",
      description: "Your API settings have been saved successfully.",
      duration: 3000,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your API provider and key. Your API key is stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>API Provider</Label>
            <Select 
              value={apiType} 
              onValueChange={(value) => setApiType(value as 'anthropic' | 'openai')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select API provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic">Anthropic (Claude 3)</SelectItem>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input 
              id="api-key" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={apiType === 'anthropic' ? 'sk-ant-api03-...' : 'sk-...'}
              type="password"
            />
          </div>
        </div>
        <Button onClick={handleSaveKeys} className="w-full">
          Save Settings
        </Button>
      </DialogContent>
    </Dialog>
  )
}