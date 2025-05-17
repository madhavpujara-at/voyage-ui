import React from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import LoginForm from '../../features/auth/presentation/components/LoginForm';
import { useLogin } from '../../features/auth/presentation/hooks/useLogin';
import { LoginUserDto } from '../../features/auth/application/dtos/LoginUserDto';

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useLogin();

  const handleLogin = async (credentials: LoginUserDto) => {
    await login(credentials);
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

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
