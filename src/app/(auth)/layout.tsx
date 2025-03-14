import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 lg:flex-none lg:items-start lg:px-0">
        <div className="z-20 w-full max-w-md">
          <div className="lg:translate-x-[50%] lg:transform">
            <Card>
              <CardContent className="p-6">{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          alt="Auth Background"
          src="/auth-background.jpeg"
          fill
          priority
          className="absolute inset-0 object-cover"
        />
      </div>
    </div>
  )
}

export default Layout
