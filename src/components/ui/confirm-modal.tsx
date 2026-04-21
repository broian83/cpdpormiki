'use client'

import { useConfirmStore } from '@/store/confirm-store'
import { Button } from './button'
import { AlertCircle, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function GlobalConfirmDialog() {
  const { isOpen, title, message, onConfirm, close, confirmLabel, cancelLabel, variant } = useConfirmStore()

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    close()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl border border-[#EFEFEF] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm",
              variant === 'danger' ? "bg-notion-red_bg text-notion-red" : "bg-notion-blue_bg text-notion-blue"
            )}>
              {variant === 'danger' ? <AlertCircle size={24} /> : <HelpCircle size={24} />}
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-serif font-bold text-notion-text mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-sm text-notion-gray leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 p-4 bg-stone-50 border-t border-[#EFEFEF]">
          <Button 
            variant="ghost" 
            onClick={close}
            className="text-sm font-bold text-notion-gray hover:text-notion-text"
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'default'}
            onClick={handleConfirm}
            className="px-6 h-10 rounded-md font-bold text-sm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
