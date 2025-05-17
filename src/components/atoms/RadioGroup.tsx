import React from 'react';
import Radio from './Radio';

export interface RadioOption {
  id: string;
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, value, onChange, className = '' }) => {
  return (
    <div className={`flex space-x-6 ${className}`}>
      {options.map((option) => (
        <Radio
          key={option.id}
          id={option.id}
          name={name}
          label={option.label}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default RadioGroup;
