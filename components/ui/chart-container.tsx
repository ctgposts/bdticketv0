'use client'

import React, { useEffect, useRef } from 'react'
import { ResponsiveContainer as RechartsResponsiveContainer, ResponsiveContainerProps } from 'recharts'

interface ChartContainerProps extends Omit<ResponsiveContainerProps, 'children'> {
  children?: React.ReactNode
}

export function ChartContainer({ children, ...props }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Suppress ResizeObserver warnings that don't affect functionality
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args[0]?.toString?.() || ''
      if (message.includes('ResizeObserver loop completed with undelivered notifications')) {
        return
      }
      originalError(...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <RechartsResponsiveContainer {...props}>
        {children}
      </RechartsResponsiveContainer>
    </div>
  )
}
