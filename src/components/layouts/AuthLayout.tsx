import React from 'react';
import Logo from '../atoms/Logo';
import Card from '../atoms/Card';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Logo className='mx-auto' />
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <Card className='px-4 py-8 sm:px-10'>{children}</Card>
      </div>
    </div>
  );
};

export default AuthLayout;
