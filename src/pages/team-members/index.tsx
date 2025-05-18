import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/organisms/Navigation';
import UserListTable from '../../features/userManagement/presentation/components/UserListTable';
import { UserRole } from '../../features/userManagement/domain/entities/User';
import { useUserRoleManagerWithServices } from '../../features/userManagement/presentation/hooks/useUserRoleManagement';
import { useGetAllUserListByRole } from '@/features/userManagement/presentation/hooks/useGetAllUserListByRole';

const TeamMembersPage: React.FC = () => {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Use the hook for fetching team members
  const {
    users: teamMembers,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchTeamMembers,
  } = useGetAllUserListByRole({ role: UserRole.TEAM_MEMBER });

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
    if (authLoading) return;

    // If user is not authenticated, redirect to login
    if (!authUser) {
      router.replace('/login');
      return;
    }

    // If user is not admin, redirect to home
    if (authUser.role !== UserRole.ADMIN) {
      router.replace('/');
      return;
    }

    setIsPageLoading(false);
  }, [authUser, authLoading, router]);

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

  // Consolidate loading states
  const combinedLoading = authLoading || isPageLoading || usersLoading;

  if (combinedLoading || !authUser) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    );
  }

  const handlePromoteUser = async (userId: string) => {
    const userToUpdate = teamMembers.find((u) => u.id === userId);
    if (userToUpdate) {
      await promoteUser(userId, userToUpdate.name);
      refetchTeamMembers();
    }
  };

  const handleDemoteUser = async (userId: string) => {
    const userToUpdate = teamMembers.find((u) => u.id === userId);
    if (userToUpdate) {
      await demoteUser(userId, userToUpdate.name);
      refetchTeamMembers();
    }
  };

  return (
    <AdminLayout username={authUser.name} onLogout={logout}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Team Members</h1>
        <p className='text-gray-600'>Manage your team members</p>
      </div>

      <Navigation />

      <div className='py-6'>
        {roleUpdateSuccess && <div className='mb-4 p-3 bg-green-100 text-green-800 rounded'>{roleUpdateSuccess}</div>}
        {roleUpdateError && <div className='mb-4 p-3 bg-red-100 text-red-800 rounded'>{roleUpdateError}</div>}
        {usersError && (
          <div className='mb-4 p-3 bg-red-100 text-red-800 rounded'>
            Error fetching users: {usersError.message}{' '}
            <button onClick={refetchTeamMembers} className='ml-2 underline'>
              Retry
            </button>
          </div>
        )}

        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          {usersLoading && !teamMembers.length ? (
            <div className='p-4 text-center text-gray-500'>Loading users...</div>
          ) : (
            <UserListTable
              users={teamMembers}
              onPromote={handlePromoteUser}
              onDemote={handleDemoteUser}
              onEdit={(userId) => console.log(`Editing user ${userId}`)}
              onDelete={(userId) => console.log(`Deleting user ${userId}`)}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeamMembersPage;
