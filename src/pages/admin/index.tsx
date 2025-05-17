import React from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import AdminDashboardView from '../../features/admin/presentation/pages/AdminDashboardView';

const AdminPage: React.FC = () => {
  const handleLogout = () => {
    // In a real app, this would call an authentication service to log out
    console.log('Logging out...');

    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AdminLayout username='Keval' onLogout={handleLogout}>
      <AdminDashboardView />
    </AdminLayout>
  );
};

export default AdminPage;
