import React, { forwardRef } from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  textColor?: string;
  placeholderColor?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, error, required = false, className = '', textColor, placeholderColor, ...props }, ref) => {
    return (
      <div className={`mb-4 ${className}`}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <Input
          id={id}
          ref={ref}
          error={error}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          textColor={textColor}
          placeholderColor={placeholderColor}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className='mt-1 text-sm text-red-500'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
