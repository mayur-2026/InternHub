import React from 'react'
import { useApp } from '../../context/AppContext'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-[#20C997] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-[#FFB347] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#4DABF7] shrink-0" />,
        }[toast.type]

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white border border-[#EDF0F6] rounded-[12px] p-3.5 card-shadow shadow-lg flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#25324B] leading-[18px]">{toast.title}</p>
              <p className="text-[12px] text-[#64748B] mt-0.5 leading-[16px]">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#8993A7] hover:text-[#25324B] transition-colors p-1 rounded-md min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

