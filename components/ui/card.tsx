"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, 
  'onTouchCancel' | 'onTouchCancelCapture' | 'onTouchEnd' | 'onTouchEndCapture' | 
  'onTouchMove' | 'onTouchMoveCapture' | 'onTouchStart' | 'onTouchStartCapture'
>

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

type CardTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>,
  'onTouchCancel' | 'onTouchCancelCapture' | 'onTouchEnd' | 'onTouchEndCapture' |
  'onTouchMove' | 'onTouchMoveCapture' | 'onTouchStart' | 'onTouchStartCapture'
>

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
