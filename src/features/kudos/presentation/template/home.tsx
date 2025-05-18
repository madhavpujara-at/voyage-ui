import React, { useEffect } from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';
import KudosList from '../components/KudosList';
import { useAuth } from '../../../../contexts/AuthContext';
import { useKudosCardList } from '../hooks/useKudosCardList';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const authorId = user?.id || ''; // Get user ID from auth context

  // Use our hook to fetch and manage kudos
  const { kudos, isLoadingList, listError, fetchKudos } = useKudosCardList(authorId);

  // Fetch kudos when the component mounts
  useEffect(() => {
    fetchKudos();
  }, [fetchKudos]);

  return (
    <AdminLayout onLogout={logout}>
      <div className='mb-6 flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Kudos Wall</h1>
          <p className='text-gray-600'>Celebrate your team&apos;s achievements</p>
        </div>
      </div>

      {listError && <div className='mb-4 p-4 bg-red-100 text-red-700 rounded'>Error loading kudos: {listError}</div>}

      <div className='py-6'>
        {isLoadingList ? (
          <div className='text-center py-10'>
            <p className='text-gray-500'>Loading kudos...</p>
          </div>
        ) : (
          <KudosList kudos={kudos} />
        )}
      </div>
    </AdminLayout>
  );
};

export default HomePage;
