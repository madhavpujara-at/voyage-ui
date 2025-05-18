import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/organisms/Navigation';
import UserListTable from '../../features/userManagement/presentation/components/UserListTable';
import { User } from '../../features/userManagement/presentation/components/UserListItem';
import { UserRole } from '@/features/userManagement/domain/entities/User';
import { useUserRoleManagerWithServices } from '@/features/userManagement/presentation/hooks/useUserRoleManagement';

// Mock data (in a real app, this would come from an API)
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: UserRole.TEAM_MEMBER,
  },
  {
    id: '2',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: UserRole.TEAM_MEMBER,
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: UserRole.TEAM_MEMBER,
  },
];

const TeamMembersPage: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Use the hook with built-in services
  const {
    promoteUser,
    demoteUser,
    error: roleUpdateError,
    successMessage: roleUpdateSuccess,
    clearMessages,
  } = useUserRoleManagerWithServices();

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

  // Show success or error message when role is updated
  useEffect(() => {
    if (roleUpdateSuccess) {
      // In a real app, you might want to use a toast notification
      console.log(roleUpdateSuccess);

      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (roleUpdateError) {
      // In a real app, you might want to use a toast notification for errors
      console.error(roleUpdateError);

      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [roleUpdateSuccess, roleUpdateError, clearMessages]);

  if (loading || isPageLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    );
  }

  const handlePromoteUser = async (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    await promoteUser(userId, user?.name);
  };

  const handleDemoteUser = async (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    await demoteUser(userId, user?.name);
  };

  return (
    <AdminLayout username={user.name} onLogout={logout}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Team Members</h1>
        <p className='text-gray-600'>Manage your team members</p>
      </div>

      <Navigation />

      <div className='py-6'>
        {roleUpdateSuccess && <div className='mb-4 p-3 bg-green-100 text-green-800 rounded'>{roleUpdateSuccess}</div>}

        {roleUpdateError && <div className='mb-4 p-3 bg-red-100 text-red-800 rounded'>{roleUpdateError}</div>}

        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <UserListTable
            users={mockUsers}
            onPromote={handlePromoteUser}
            onDemote={handleDemoteUser}
            onEdit={(userId) => console.log(`Editing user ${userId}`)}
            onDelete={(userId) => console.log(`Deleting user ${userId}`)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeamMembersPage;
