import React from 'react';
import AdminLayout from '../../../../components/layouts/AdminLayout';
import KudosList from '../components/KudosList';
import { Kudos } from '../components/KudosList';
import { useAuth } from '../../../../contexts/AuthContext';

const mockKudos: Kudos[] = [
  {
    id: '1',
    recipient: 'Jane Smith',
    team: 'Infra',
    category: 'Brilliant Idea',
    message:
      'Jane implemented a brilliant solution that improved our system performance by 40%. Her innovative approach saved us weeks of work!',
    from: {
      name: 'Michael Johnson',
      date: 'May 10, 2023',
    },
    likes: 3,
    comments: 2,
  },
  {
    id: '2',
    recipient: 'David Lee',
    team: 'UI',
    category: 'Great Teamwork',
    message:
      'David went out of his way to help our team meet the deadline. He stayed late and provided valuable insights that made the project successful.',
    from: {
      name: 'Sarah Williams',
      date: 'May 8, 2023',
    },
    likes: 2,
    comments: 1,
  },
];

const HomePage: React.FC = () => {
  const { logout } = useAuth();

  return (
    <AdminLayout onLogout={logout}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Kudos Wall</h1>
        <p className='text-gray-600'>Celebrate your team&apos;s achievements</p>
      </div>

      <div className='py-6'>
        <KudosList kudos={mockKudos} />
      </div>
    </AdminLayout>
  );
};

export default HomePage;
