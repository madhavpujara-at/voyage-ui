import React, { ReactNode } from 'react';
import Head from 'next/head';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title = 'Authentication' }) => {
  return (
    <>
      <Head>
        <title>{title} | Voyage UI</title>
      </Head>

      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>{children}</div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
