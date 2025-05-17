import React from 'react';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
}

const Radio: React.FC<RadioProps> = ({ id, label, className = '', ...props }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <input
        id={id}
        type='radio'
        className='w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500'
        {...props}
      />
      <label htmlFor={id} className='ml-2 text-sm font-medium text-gray-900'>
        {label}
      </label>
    </div>
  );
};

export default Radio;
