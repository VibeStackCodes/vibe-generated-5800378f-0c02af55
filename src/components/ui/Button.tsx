import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children, ariaLabel, className, disabled }) => {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    ghost: 'bg-transparent text-primary hover:bg-blue-50 border border-transparent',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${styles[variant]} ${className ?? ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
