import React from 'react';
import Head from 'next/head';
import LoginForm from '../../features/auth/presentation/components/LoginForm';
import { useLogin } from '../../features/auth/presentation/hooks/useLogin';
import { LoginUserDto } from '../../features/auth/application/dtos/LoginUserDto';

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useLogin();

  const handleSubmit = (data: LoginUserDto) => {
    login(data);
  };

  return (
    <>
      <Head>
        <title>Login | Digital Kudos Wall</title>
        <meta name='description' content='Sign in to your Digital Kudos Wall account' />
      </Head>
      <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-extrabold text-gray-900'>Digital Kudos Wall</h1>
            <p className='mt-2 text-sm text-gray-600'>Sign in to your account</p>
          </div>
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
