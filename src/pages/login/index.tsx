import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      // The login function in AuthContext will handle redirection
    } catch {
      toast.error(
        'Invalid email or password. Try admin@example.com / password123, lead@example.com / password123, or member@example.com / password123',
        {
          duration: 4000,
          position: 'top-center',
        }
      );
      // Reset form fields
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Welcome back</h2>
        <p className='mt-2 text-sm text-gray-600'>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='email' className='block mb-1 text-sm font-medium text-gray-900'>
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='name@example.com'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500'
            required
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='password' className='block mb-1 text-sm font-medium text-gray-900'>
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500'
            required
          />
        </div>

        <div className='mt-6'>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50'
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='font-medium text-purple-600 hover:text-purple-500'>
              Sign up
            </Link>
          </p>
        </div>
      </form>

      <div className='mt-6 border-t border-gray-200 pt-4'>
        <p className='text-sm text-gray-500 text-center'>For demo purposes, use these credentials:</p>
        <ul className='mt-2 text-xs text-gray-500'>
          <li className='mb-1'>Admin: admin@example.com / password123</li>
          <li className='mb-1'>Tech Lead: lead@example.com / password123</li>
          <li>Team Member: member@example.com / password123</li>
        </ul>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
