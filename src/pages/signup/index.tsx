import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import SignupForm from '../../features/auth/presentation/components/SignupForm';

const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (fullName: string, email: string, role: string, password: string) => {
    setIsLoading(true);

    // In a real app, this would call an authentication service
    console.log('Signing up with:', { fullName, email, role, password });

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll just redirect to the login page
      // In a real app, you'd create the user and handle errors
      window.location.href = '/login';
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout>
      <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
    </AuthLayout>
  );
};

export default SignupPage;
