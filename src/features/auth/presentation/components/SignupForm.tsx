import React, { useState } from 'react';
import Link from 'next/link';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import RadioGroup from '@/components/atoms/RadioGroup';

interface SignupFormProps {
  onSubmit: (fullName: string, email: string, role: string, password: string) => void;
  isLoading?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading = false }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('team_member');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const roleOptions = [
    { id: 'role-team-member', label: 'Team Member', value: 'team_member' },
    { id: 'role-tech-lead', label: 'Tech Lead', value: 'tech_lead' },
  ];

  const validateForm = (): boolean => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(fullName, email, role, password);
    }
  };

  return (
    <div>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Create an account</h2>
        <p className='mt-2 text-sm text-gray-600'>Enter your details to create your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <FormField
          id='fullName'
          name='fullName'
          type='text'
          label='Full Name'
          placeholder='John Doe'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          required
        />

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

        <div className='mb-4'>
          <label className='block mb-1 text-sm font-medium text-gray-900'>Role</label>
          <RadioGroup options={roleOptions} name='role' value={role} onChange={(e) => setRole(e.target.value)} />
        </div>

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

        <FormField
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          label='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <div className='mt-6'>
          <Button type='submit' isFullWidth disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
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
