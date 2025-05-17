import React from 'react';
import Navbar from '../organisms/Navbar';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  username?: string;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, username = 'Admin', onLogout }) => {
  const { user } = useAuth();
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar username={username} onLogout={onLogout} userRole={user?.role} />

      <main className='py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
