'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => setShow(true), 10)
    } else {
      setShow(false)
      const timer = setTimeout(() => {
        document.body.style.overflow = 'auto'
      }, 300)
    }

    // Cleanup function to ensure scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div 
        className={`relative w-full max-w-md bg-white rounded-t-[2rem] p-8 shadow-2xl transition-transform duration-300 ease-out transform ${show ? 'translate-y-0' : 'translate-y-full'} pointer-events-auto`}
      >
        {/* Handle for dragging feel */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-200 rounded-full cursor-grab active:cursor-grabbing" onClick={onClose} />
        
        <div className="flex items-center justify-between mb-8 mt-2">
          {title && <h3 className="text-2xl font-serif font-bold text-notion-text">{title}</h3>}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-50 rounded-full transition-colors ml-auto"
          >
            <X className="w-5 h-5 text-notion-gray" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  )
}
