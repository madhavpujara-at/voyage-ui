import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '@/features/users/domain/entities/UserRole';
import KudoCardForm from '@/features/kudos/presentation/components/KudoCardForm';

const CreateKudosPage: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // If authentication is still loading, wait
    if (loading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // If user is not admin or tech_lead, redirect to home
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.TECH_LEAD) {
      router.replace('/');
      return;
    }

    setIsPageLoading(false);
  }, [user, loading, router]);

  const handleSuccess = () => {
    // Redirect to home page after successful creation
    router.push('/');
  };

  if (loading || isPageLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    );
  }

  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Create Kudos</h1>
        <p className='text-gray-600'>Recognize your team members&apos; achievements</p>
      </div>

      <div className='py-6'>
        <KudoCardForm onSuccess={handleSuccess} className='sm:rounded-lg' />
      </div>
    </AdminLayout>
  );
};

export default CreateKudosPage;
