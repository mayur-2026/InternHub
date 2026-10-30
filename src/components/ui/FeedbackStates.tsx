import React from 'react'
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  badge?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-6 ${className}`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-[22px] md:text-[24px] font-bold leading-[30px] md:leading-[32px] text-[#25324B] tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-[14px] font-normal leading-[22px] text-[#64748B] mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  )
}

export interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-[12px] border border-[#EDF0F6] card-shadow ${className}`}
    >
      <div className="w-[52px] h-[52px] rounded-[12px] bg-[#F3F0FF] text-[#7950F2] flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-6 h-6" strokeWidth={1.75} />}
      </div>
      <h4 className="text-[16px] font-semibold text-[#25324B]">{title}</h4>
      <p className="text-[14px] text-[#64748B] max-w-sm mt-1.5 leading-[22px]">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 bg-[#FEF2F2] border border-[#fecaca] rounded-[12px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[14px] font-semibold text-[#DC2626]">{title}</h4>
          <p className="text-[13px] text-[#991B1B] mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-[#fecaca] bg-white text-[#DC2626] hover:bg-[#FEF2F2]"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}

export const LoadingState: React.FC<{ label?: string; className?: string }> = ({
  label = 'Loading workspace data...',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[300px] p-8 text-center ${className}`}
      role="status"
    >
      <div className="w-10 h-10 border-3 border-[#EEF1F7] border-t-[#7950F2] rounded-full animate-spin mb-3" />
      <p className="text-[14px] font-medium text-[#64748B]">{label}</p>
    </div>
  )
}

