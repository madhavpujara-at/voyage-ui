import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({ children, className = '', required = false, ...props }) => {
  return (
    <label className={`block mb-1 text-sm font-medium text-gray-900 ${className}`} {...props}>
      {children}
      {required && <span className='ml-1 text-red-500'>*</span>}
    </label>
  );
};

export default Label;
