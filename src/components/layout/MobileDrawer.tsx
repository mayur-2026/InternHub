import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'

export interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden bg-slate-900/40 backdrop-blur-xs flex animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Drawer"
    >
      <div
        ref={drawerRef}
        className="w-[280px] max-w-[85vw] h-full bg-white shadow-2xl relative flex flex-col animate-in slide-in-from-left duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC] rounded-lg transition-colors z-20 min-h-[44px] min-w-[44px] flex items-center justify-center focus-ring cursor-pointer"
          aria-label="Close navigation drawer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 h-full overflow-hidden">
          <Sidebar onItemClick={onClose} />
        </div>
      </div>
    </div>
  )
}
