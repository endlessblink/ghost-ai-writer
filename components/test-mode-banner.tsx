"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TestModeBanner() {
  return (
    <Alert className="bg-yellow-50 dark:bg-yellow-900/20">
      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
      <AlertTitle className="text-yellow-600 dark:text-yellow-500">Test Mode Available</AlertTitle>
      <AlertDescription className="text-yellow-600 dark:text-yellow-500">
        To test the application without an API key, use the sample data provided in the form. 
        This will generate a mock resume to preview the functionality.
      </AlertDescription>
    </Alert>
  )
}