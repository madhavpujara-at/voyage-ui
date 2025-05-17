import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/organisms/Navigation';
import UserListTable from '../../features/users/presentation/components/UserListTable';
import { User } from '../../features/users/presentation/components/UserListItem';
import { UserRole } from '@/features/users/domain/entities/UserRole';

// Mock data (in a real app, this would come from an API)
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'team_member',
  },
  {
    id: '2',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'team_member',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'team_member',
  },
];

const TeamMembersPage: React.FC = () => {
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
        <h1 className='text-2xl font-bold text-gray-900'>Team Members</h1>
        <p className='text-gray-600'>Manage your team members</p>
      </div>

      <Navigation />

      <div className='py-6'>
        <div className='flex justify-end mb-4'>
          <button
            type='button'
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
          >
            Add Team Member
          </button>
        </div>

        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <UserListTable
            users={mockUsers}
            onPromote={(userId) => console.log(`Promoting user ${userId}`)}
            onEdit={(userId) => console.log(`Editing user ${userId}`)}
            onDelete={(userId) => console.log(`Deleting user ${userId}`)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeamMembersPage;
