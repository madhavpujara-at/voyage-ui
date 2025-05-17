import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  textColor?: string;
  placeholderColor?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className = '', error, textColor = 'text-gray-900', placeholderColor = 'placeholder-gray-400', ...props },
    ref
  ) => {
    return (
      <div className='w-full'>
        <input
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 
              ${error ? 'border-red-500' : 'border-gray-300'} 
              ${textColor} ${placeholderColor}
              ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
