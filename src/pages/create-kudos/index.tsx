import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/organisms/Navigation';

const CreateKudosPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // If authentication is still loading, wait
    if (isLoading) return;

    // If user is not authenticated, redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // If user is not admin or tech_lead, redirect to home
    if (user.role !== 'admin' && user.role !== 'tech_lead') {
      router.replace('/');
      return;
    }

    setIsPageLoading(false);
  }, [user, isLoading, router]);

  if (isLoading || isPageLoading || !user) {
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

      <Navigation userRole={user.role} activeTab='create-kudos' />

      <div className='py-6'>
        <div className='bg-white shadow overflow-hidden sm:rounded-lg p-6'>
          <form className='space-y-6'>
            <div>
              <label htmlFor='recipient' className='block text-sm font-medium text-gray-700'>
                Recipient
              </label>
              <select
                id='recipient'
                name='recipient'
                className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md'
              >
                <option>Select a team member</option>
                <option>Jane Smith</option>
                <option>David Lee</option>
                <option>Sarah Williams</option>
              </select>
            </div>

            <div>
              <label htmlFor='team' className='block text-sm font-medium text-gray-700'>
                Team
              </label>
              <select
                id='team'
                name='team'
                className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md'
              >
                <option>Select a team</option>
                <option>UI</option>
                <option>Infra</option>
                <option>Backend</option>
              </select>
            </div>

            <div>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
                Category
              </label>
              <select
                id='category'
                name='category'
                className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md'
              >
                <option>Select a category</option>
                <option>Brilliant Idea</option>
                <option>Great Teamwork</option>
                <option>Outstanding Support</option>
                <option>Problem Solver</option>
              </select>
            </div>

            <div>
              <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
                Message
              </label>
              <div className='mt-1'>
                <textarea
                  id='message'
                  name='message'
                  rows={4}
                  className='shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md'
                  placeholder='Describe why this person deserves recognition...'
                />
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                type='button'
                className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mr-3'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              >
                Submit Kudos
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateKudosPage;
