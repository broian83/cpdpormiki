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
      default: 'bg-[#37352f] text-white hover:bg-stone-800 shadow-sm active:scale-[0.98]',
      primary: 'bg-[#337ea9] text-white hover:bg-[#2e7197] shadow-sm active:scale-[0.98]',
      secondary: 'bg-white border border-[#EFEFEF] text-[#37352f] hover:bg-stone-50 hover:border-stone-300 shadow-sm active:scale-[0.98]',
      outline: 'border border-[#EFEFEF] text-[#37352f] hover:bg-stone-50 active:scale-[0.98]',
      ghost: 'text-[#37352f] hover:bg-stone-50 active:scale-[0.98]',
      danger: 'bg-[#d44c47] text-white hover:bg-[#bb433f] shadow-sm active:scale-[0.98]',
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
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
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