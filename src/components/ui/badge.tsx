import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success:
          'rounded-full border-transparent bg-green-100 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-600/20',
        destructive:
          'rounded-full border-transparent bg-red-50 px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-600/20',
        warning:
          'rounded-full border-transparent bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-600/20',
        info: 'rounded-full border-transparent bg-blue-50 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-600/20',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
