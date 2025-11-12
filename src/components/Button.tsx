// Reusable Button component

import React from 'react';
import {
  CircleStackIcon,
  PlusIcon,
  CheckIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  state?: 'default' | 'hover' | 'active' | 'disabled';
  leadingIcon?: 'circle' | 'plus' | 'check' | 'arrow-right' | 'ellipsis' | React.ReactNode;
  trailingIcon?: 'circle' | 'plus' | 'check' | 'arrow-right' | 'ellipsis' | React.ReactNode;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const renderIcon = (icon: ButtonProps['leadingIcon'], className?: string) => {
  if (React.isValidElement(icon)) {
    return icon;
  }
  
  switch (icon) {
    case 'circle':
      return <CircleStackIcon className={className} />;
    case 'plus':
      return <PlusIcon className={className} />;
    case 'check':
      return <CheckIcon className={className} />;
    case 'arrow-right':
      return <ArrowRightIcon className={className} />;
    case 'ellipsis':
      return <EllipsisVerticalIcon className={className} />;
    default:
      return null;
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'small',
  state = 'default',
  leadingIcon,
  trailingIcon,
  showLeadingIcon = false,
  showTrailingIcon = false,
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}) => { 
  // Base classes with exact specifications
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm';

  const variantClasses = {
    primary: 'bg-primary-main hover:bg-primary-hover active:bg-primary-pressed text-white focus:bg-primary-focus',
    secondary: 'bg-secondary-main hover:bg-secondary-hover active:bg-secondary-pressed text-white focus:bg-secondary-focus',
    danger: 'bg-danger-main hover:bg-danger-hover active:bg-danger-pressed text-white focus:bg-danger-focus',
    warning: 'bg-warning-main hover:bg-warning-hover active:bg-warning-pressed text-white focus:bg-warning-focus'
  };

  // Exact size specifications matching your design
  const sizeClasses = {
    small: 'h-7 px-4 py-1 text-sm gap-1', // height: 28px, padding: 4px 16px, gap: 4px
    medium: 'h-10 px-6 py-2 text-base gap-2', // height: 40px, padding: 8px 24px, gap: 8px  
    large: 'h-12 px-8 py-3 text-lg gap-2' // height: 48px, padding: 12px 32px, gap: 8px
  };

  const stateClasses = {
    default: '',
    hover: 'hover:scale-[1.02]',
    active: 'active:scale-[0.98]',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none'
  };

  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses[state],
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const iconSize = size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      style={{
        // Exact specifications from your design
        boxShadow: size === 'small' ? '0px 1px 2px 0px rgba(0, 0, 0, 0.12)' : undefined,
        minWidth: size === 'small' ? '86px' : undefined,
      }}
      {...props}
    >
      {isLoading && (
        <svg
          className={`animate-spin ${iconSize}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!isLoading && showLeadingIcon && leadingIcon && (
        renderIcon(leadingIcon, iconSize)
      )}
      
      <span className="whitespace-nowrap">
        {children}
      </span>
      
      {!isLoading && showTrailingIcon && trailingIcon && (
        renderIcon(trailingIcon, iconSize)
      )}
    </button>
  );
};