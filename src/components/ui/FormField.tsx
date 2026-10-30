import React from 'react'

export interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label className="text-[13px] font-medium leading-[20px] text-[#25324B] flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-[#DC2626] ml-1">*</span>}
          </span>
          {hint && <span className="text-[12px] font-normal text-[#8993A7]">{hint}</span>}
        </label>
      )}
      {children}
      {error && <p className="text-[12px] font-normal text-[#DC2626] mt-0.5">{error}</p>}
    </div>
  )
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  hasError?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, hasError, className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-3.5 text-[#8993A7] pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full min-h-[42px] px-3.5 ${
            icon ? 'pl-10' : ''
          } bg-[#F5F7FC] border ${
            hasError ? 'border-[#DC2626]' : 'border-[#EDF0F6]'
          } rounded-[8px] text-[16px] md:text-[14px] leading-[20px] text-[#25324B] placeholder:text-[#8993A7] focus-ring transition-colors ${className}`}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full p-3 bg-[#F5F7FC] border ${
          hasError ? 'border-[#DC2626]' : 'border-[#EDF0F6]'
        } rounded-[8px] text-[16px] md:text-[14px] leading-[22px] text-[#25324B] placeholder:text-[#8993A7] focus-ring transition-colors min-h-[100px] resize-y ${className}`}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, hasError, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full min-h-[42px] px-3.5 bg-[#F5F7FC] border ${
          hasError ? 'border-[#DC2626]' : 'border-[#EDF0F6]'
        } rounded-[8px] text-[16px] md:text-[14px] leading-[20px] text-[#25324B] focus-ring transition-colors cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

