import React from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import SignupForm from '../../features/auth/presentation/components/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
