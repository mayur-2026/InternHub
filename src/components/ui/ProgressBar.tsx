import React from 'react'

export interface ProgressBarProps {
  value: number // 0 to 100
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'project'
  showLabel?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'primary',
  showLabel = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  const fillStyles = {
    primary: 'bg-[#7950F2]',
    success: 'bg-[#20C997]',
    warning: 'bg-[#FFB347]',
    info: 'bg-[#4DABF7]',
    project: 'bg-[#F06595]',
  }[variant]

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-[12px] font-medium text-[#64748B] mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-[#25324B]">{clampedValue}%</span>
        </div>
      )}
      <div className="w-full h-[6px] bg-[#EEF1F7] rounded-full overflow-hidden">
        <div
          className={`h-full ${fillStyles} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}

