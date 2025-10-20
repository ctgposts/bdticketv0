'use client'

import React, { useEffect, useRef } from 'react'
import { ResponsiveContainer as RechartsResponsiveContainer, ResponsiveContainerProps } from 'recharts'

interface ChartContainerProps extends Omit<ResponsiveContainerProps, 'children'> {
  children?: React.ReactNode
}

export function ChartContainer({ children, ...props }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Suppress ResizeObserver loop warning that doesn't affect functionality
    // This is a known issue with recharts ResponsiveContainer and doesn't impact user experience
    const originalError = console.error
    const errorHandler = (...args: any[]) => {
      const errorMessage = args[0]?.toString?.() || ''
      // Filter out the specific ResizeObserver warning
      if (
        typeof errorMessage === 'string' &&
        errorMessage.includes('ResizeObserver loop completed with undelivered notifications')
      ) {
        return
      }
      originalError.apply(console, args)
    }

    console.error = errorHandler

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    >
      <RechartsResponsiveContainer {...props}>
        {children}
      </RechartsResponsiveContainer>
    </div>
  )
}
