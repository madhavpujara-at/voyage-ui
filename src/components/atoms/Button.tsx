import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500',
    secondary: 'bg-white text-teal-800 hover:bg-teal-50 focus:ring-teal-300 border border-teal-200',
    link: 'text-white hover:text-teal-200 underline p-0 hover:no-underline focus:ring-0',
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const widthClass = isFullWidth ? 'w-full' : '';

  // Skip padding for link variant
  const applySizeClass = variant === 'link' ? '' : sizeClasses[size];

  return (
    <button
      className={`${baseClass} ${variantClasses[variant]} ${applySizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
