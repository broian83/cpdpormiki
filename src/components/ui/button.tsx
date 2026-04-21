'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-[#37352f] text-white hover:bg-[#2e2c26] border border-[#37352f] shadow-sm', // Untuk BG Terang (Primary Action)
      secondary: 'bg-white border border-[#EFEFEF] text-[#37352f] hover:bg-stone-50 shadow-sm', // Untuk BG Terang (Secondary Action)
      inverted: 'bg-white text-[#37352f] hover:bg-stone-100 border border-transparent shadow-md', // Untuk BG Gelap (Primary Action di dalam dark card)
      ghost: 'text-[#37352f] hover:bg-stone-50 bg-transparent border border-transparent', // Transparan tanpa outline
      danger: 'bg-white border border-[#EFEFEF] text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm', // Gaya Boxy untuk bahaya
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all active:scale-[0.98] duration-200',
          'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant as keyof typeof variants] || variants.default,
          sizes[size as keyof typeof sizes] || sizes.md,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }