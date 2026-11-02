import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-[8px] transition-all duration-150 focus-ring cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] md:min-h-[40px]'

  const sizeStyles = {
    sm: 'text-[13px] px-3 py-1.5 min-h-[36px]',
    md: 'text-[14px] px-4 py-2 min-h-[40px]',
    lg: 'text-[15px] px-5 py-2.5 min-h-[44px]',
  }[size]

  const variantStyles = {
    primary: 'bg-[#7950F2] text-white hover:bg-[#6741D9] active:bg-[#5f3dc4] shadow-sm',
    secondary: 'bg-[#F5F7FC] text-[#25324B] hover:bg-[#EDF0F6] active:bg-[#e4e7ee]',
    outline: 'border border-[#EDF0F6] bg-white text-[#25324B] hover:bg-[#F5F7FC] hover:border-[#dde1ea]',
    ghost: 'bg-transparent text-[#64748B] hover:text-[#25324B] hover:bg-[#F5F7FC]',
    danger: 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] active:bg-[#fecaca] border border-[#fecaca]',
  }[variant]

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="inline-flex mr-2 items-center shrink-0">{icon}</span>
      ) : null}
      <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">{children}</span>
    </button>
  )
}
