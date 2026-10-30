import React from 'react'

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'info' | 'project' | 'error'

export interface StatusBadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'primary',
  children,
  icon,
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-[#F3F0FF] text-[#7950F2]',
    success: 'bg-[#E6FCF5] text-[#087F5B]',
    warning: 'bg-[#FFF4E6] text-[#9A4D00]',
    info: 'bg-[#E7F5FF] text-[#1864AB]',
    project: 'bg-[#FFF0F6] text-[#C2255C]',
    error: 'bg-[#FEF2F2] text-[#DC2626]',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-[8px] py-[3px] rounded-full text-[12px] font-semibold leading-[16px] select-none tracking-normal ${variantStyles} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

