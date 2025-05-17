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
    primary: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    link: 'text-purple-500 hover:text-purple-700 underline p-0 hover:no-underline focus:ring-0',
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
