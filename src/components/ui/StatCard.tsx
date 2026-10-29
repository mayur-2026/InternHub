import React from 'react'
import { Card } from './Card'
import { MetricIcon } from './MetricIcon'
import type { BadgeVariant } from './StatusBadge'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  variant?: BadgeVariant
  trend?: {
    value: string
    isPositive?: boolean
  }
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'primary',
  trend,
  onClick,
}) => {
  return (
    <Card
      padding="md"
      className={`relative overflow-hidden transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-[#7950F2]/40 hover:shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <MetricIcon icon={icon} variant={variant} />
        {trend && (
          <span
            className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive !== false
                ? 'bg-[#E6FCF5] text-[#087F5B]'
                : 'bg-[#FFF4E6] text-[#9A4D00]'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-[13px] font-medium leading-[20px] text-[#64748B] line-clamp-1">{title}</p>
        <p className="text-[26px] font-bold leading-[32px] text-[#25324B] mt-1 tracking-tight">{value}</p>
        <p className="text-[12px] font-normal leading-[18px] text-[#8993A7] mt-0.5 line-clamp-1">{subtitle}</p>
      </div>
    </Card>
  )
}
