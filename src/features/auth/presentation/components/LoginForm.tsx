import React, { useState } from 'react';
import Link from 'next/link';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(email, password);
    }
  };

  return (
    <div>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Welcome back</h2>
        <p className='mt-2 text-sm text-gray-600'>Enter your credentials to sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <FormField
          id='email'
          name='email'
          type='email'
          label='Email'
          placeholder='name@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <FormField
          id='password'
          name='password'
          type='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className='mt-6'>
          <Button type='submit' isFullWidth disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className='mt-4 text-center'>
        <a href='#' className='text-sm text-purple-600 hover:text-purple-500'>
          Forgot your password?
        </a>
      </div>

      <div className='mt-4 text-center'>
        <span className='text-sm text-gray-600'>Don&apos;t have an account? </span>
        <Link href='/signup' className='text-sm text-purple-600 hover:text-purple-500'>
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
