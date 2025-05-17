import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../components/organisms/Navigation';

const AnalyticsPage: React.FC = () => {
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
        <h1 className='text-2xl font-bold text-gray-900'>Analytics Dashboard</h1>
        <p className='text-gray-600'>Track kudos metrics and engagement</p>
      </div>

      <Navigation />

      <div className='py-6'>
        <div className='bg-white shadow overflow-hidden sm:rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>Total Kudos</h3>
              <p className='text-3xl font-bold text-purple-600 mt-2'>42</p>
              <p className='text-sm text-gray-500 mt-1'>+12% from last month</p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>Active Members</h3>
              <p className='text-3xl font-bold text-purple-600 mt-2'>18</p>
              <p className='text-sm text-gray-500 mt-1'>+3 new this month</p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>Top Category</h3>
              <p className='text-3xl font-bold text-purple-600 mt-2'>Teamwork</p>
              <p className='text-sm text-gray-500 mt-1'>15 kudos in this category</p>
            </div>
          </div>

          <div className='mt-8'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Monthly Kudos Trend</h3>
            <div className='h-64 bg-gray-100 flex items-center justify-center rounded'>
              <p className='text-gray-500'>Chart placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
