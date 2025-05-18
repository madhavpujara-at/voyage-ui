import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/organisms/Navigation';

import { UserRole } from '../../features/userManagement/domain/entities/User'; // Corrected path
import UserListTable from '../../features/userManagement/presentation/components/UserListTable'; // Corrected path
import { useGetAllUserListByRole } from '@/features/userManagement/presentation/hooks/useGetAllUserListByRole';
import { useUserRoleManagerWithServices } from '@/features/userManagement/presentation/hooks/useUserRoleManagement';

const TechLeadsPage: React.FC = () => {
  const router = useRouter();
  const { user: authUser, loading: authLoading, logout } = useAuth(); // Renamed user to authUser
  const [isPageLoading, setIsPageLoading] = useState(true); // May be redundant

  // Use the hook for fetching tech leads
  const {
    users: techLeads,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchTechLeads,
  } = useGetAllUserListByRole({ role: UserRole.TECH_LEAD });

  // Instantiate the user role management hook
  const { demoteUser } = useUserRoleManagerWithServices();

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      router.replace('/login');
      return;
    }
    if (authUser.role !== UserRole.ADMIN) {
      router.replace('/');
      return;
    }
    setIsPageLoading(false);
  }, [authUser, authLoading, router]);

  const combinedLoading = authLoading || isPageLoading || usersLoading;

  if (combinedLoading || !authUser) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    );
  }

  // Handler for demoting a user
  const handleDemoteUser = async (userId: string, userName?: string) => {
    const success = await demoteUser(userId, userName);
    if (success) {
      // The successMessage state from the hook will update and trigger a re-render for UI feedback.
      // For immediate actions like refetching, using the direct boolean result is more reliable.
      console.log('Demotion action successful, refetching tech leads.');
      refetchTechLeads(); // Refetch after successful demotion
    } else {
      // The error state from the hook will update for UI feedback.
      // You can still access error state from the hook if needed for display, by not removing it above.
      console.error('Demotion action failed.');
    }
    // Note: demotionSuccessMessage and demotionError might not be updated yet in this specific tick.
    // UI feedback depending on them should be based on their state causing a re-render.
  };

  return (
    <AdminLayout username={authUser.name} onLogout={logout}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Tech Leads</h1>
        <p className='text-gray-600'>Manage your tech leads</p>
      </div>

      <Navigation />

      <div className='py-6'>
        {usersError && (
          <div className='mb-4 p-3 bg-red-100 text-red-800 rounded'>
            Error fetching users: {usersError.message}{' '}
            <button onClick={refetchTechLeads} className='ml-2 underline'>
              Retry
            </button>
          </div>
        )}

        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          {usersLoading && !techLeads.length ? (
            <div className='p-4 text-center text-gray-500'>Loading users...</div>
          ) : (
            <UserListTable
              users={techLeads} // Use fetched tech leads
              // Pass appropriate handlers if actions like promote/demote apply to TechLeads
              // For now, using console logs as placeholders from original code
              onPromote={(userId) => console.log(`Promoting user ${userId}`)}
              onDemote={handleDemoteUser} // Use the new handler
              onEdit={(userId) => console.log(`Editing user ${userId}`)}
              onDelete={(userId) => console.log(`Deleting user ${userId}`)}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TechLeadsPage;
