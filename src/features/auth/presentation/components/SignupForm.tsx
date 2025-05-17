import React from 'react';
import Link from 'next/link';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { useRegister } from '../hooks/useRegister';
import { useRegisterForm } from '../hooks/useRegisterForm';

const SignupForm: React.FC = () => {
  const { register, loading, error: registerError } = useRegister();

  const { fields, handleChange, handleSubmit, isSubmitting, generalError } = useRegisterForm({
    onSubmit: async (formData) => {
      return register(formData);
    },
    redirectPath: '/',
  });

  return (
    <div>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Create an account</h2>
        <p className='mt-2 text-sm text-gray-600'>Enter your details to create your account</p>
      </div>

      {(generalError || registerError) && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-4'>
          <p className='text-red-700'>{generalError || registerError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormField
          id='name'
          name='name'
          type='text'
          label='Full Name'
          placeholder='John Doe'
          value={fields.name.value}
          onChange={handleChange}
          error={fields.name.error || undefined}
          required
        />

        <FormField
          id='email'
          name='email'
          type='email'
          label='Email'
          placeholder='name@example.com'
          value={fields.email.value}
          onChange={handleChange}
          error={fields.email.error || undefined}
          required
        />

        <FormField
          id='password'
          name='password'
          type='password'
          label='Password'
          value={fields.password.value}
          onChange={handleChange}
          error={fields.password.error || undefined}
          required
        />

        <FormField
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          label='Confirm Password'
          value={fields.confirmPassword.value}
          onChange={handleChange}
          error={fields.confirmPassword.error || undefined}
          required
        />

        <div className='mt-6'>
          <Button type='submit' isFullWidth disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>

      <div className='mt-4 text-center'>
        <span className='text-sm text-gray-600'>Already have an account? </span>
        <Link href='/login' className='text-sm text-purple-600 hover:text-purple-500'>
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
