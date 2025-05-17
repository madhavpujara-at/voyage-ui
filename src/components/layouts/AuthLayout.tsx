import React, { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';

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
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='flex justify-center'>
            <div className='w-32 h-32 relative'>
              <Image src='/logo.svg' alt='Voyage Logo' layout='fill' objectFit='contain' priority />
            </div>
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Voyage</h2>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>{children}</div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
