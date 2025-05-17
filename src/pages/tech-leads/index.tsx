import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/organisms/Navigation';
import LeadListTable from '../../features/users/presentation/components/LeadListTable';
import { User } from '../../features/users/presentation/components/UserListItem';
import { UserRole } from '@/features/users/domain/entities/UserRole';

// Mock data (in a real app, this would come from an API)
const mockLeads: User[] = [
  {
    id: '1',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'tech_lead',
  },
  {
    id: '2',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    role: 'tech_lead',
  },
  {
    id: '3',
    name: 'Michael Thompson',
    email: 'michael.thompson@example.com',
    role: 'tech_lead',
  },
];

const TechLeadsPage: React.FC = () => {
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

    // If user is not admin, redirect to home
    if (user.role !== UserRole.ADMIN) {
      router.replace('/');
      return;
    }

    setIsPageLoading(false);
  }, [user, loading, router]);

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
        <h1 className='text-2xl font-bold text-gray-900'>Tech Leads</h1>
        <p className='text-gray-600'>Manage your tech leads</p>
      </div>

      <Navigation />

      <div className='py-6'>
        {/* <div className='flex justify-end mb-4'>
          <button
            type='button'
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
          >
            Add Tech Lead
          </button>
        </div> */}

        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <LeadListTable
            leads={mockLeads}
            onDemote={(leadId) => console.log(`Demoting lead ${leadId}`)}
            onEdit={(leadId) => console.log(`Editing lead ${leadId}`)}
            onDelete={(leadId) => console.log(`Deleting lead ${leadId}`)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default TechLeadsPage;
