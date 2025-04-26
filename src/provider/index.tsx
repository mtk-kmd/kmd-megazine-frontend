'use client'

import React from 'react'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

const queryClient = new QueryClient()

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default Provider
