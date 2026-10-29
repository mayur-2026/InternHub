import React from 'react'
import type { BadgeVariant } from './StatusBadge'

export interface MetricIconProps {
  icon: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export const MetricIcon: React.FC<MetricIconProps> = ({
  icon,
  variant = 'primary',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-[#F3F0FF] text-[#7950F2]',
    success: 'bg-[#E6FCF5] text-[#20C997]',
    warning: 'bg-[#FFF4E6] text-[#FFB347]',
    info: 'bg-[#E7F5FF] text-[#4DABF7]',
    project: 'bg-[#FFF0F6] text-[#F06595]',
    error: 'bg-[#FEF2F2] text-[#DC2626]',
  }[variant]

  return (
    <div
      className={`w-[36px] h-[36px] min-w-[36px] rounded-[10px] flex items-center justify-center shrink-0 ${variantStyles} ${className}`}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ className?: string; strokeWidth?: number; size?: number }>, {
            className: 'w-[19px] h-[19px]',
            strokeWidth: 1.75,
          })
        : icon}
    </div>
  )
}
