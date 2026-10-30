import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  // Keep latest onClose reference without triggering re-runs
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      // Capture element that opened the modal only upon initial open
      previousActiveElement.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCloseRef.current()
          return
        }

        // Accessible Focus Trapping for Tab / Shift+Tab
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )

          if (focusableElements.length === 0) {
            e.preventDefault()
            return
          }

          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement.focus()
            }
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
        // Restore focus to opener element only when modal completely closes or unmounts
        if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
          previousActiveElement.current.focus()
        }
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseRef.current()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidthStyles} bg-white rounded-[12px] border border-[#EDF0F6] card-shadow shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#EDF0F6] bg-white sticky top-0 z-10">
          <div>
            <h3
              id="modal-headline"
              className="text-[16px] sm:text-[18px] font-semibold text-[#25324B] leading-[24px]"
            >
              {title}
            </h3>
            {description && (
              <p className="text-[12px] sm:text-[13px] text-[#64748B] mt-0.5 leading-[18px]">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={() => onCloseRef.current()}
            className="text-[#8993A7] hover:text-[#25324B] hover:bg-[#F5F7FC] p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer focus-ring"
            aria-label="Close dialog"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
