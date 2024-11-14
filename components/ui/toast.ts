import { ToastProps as RadixToastProps } from "@radix-ui/react-toast"

export interface ToastProps extends RadixToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactElement 