import React from 'react';
import AdminTabs from '../components/AdminTabs';
import { Kudos } from '../../../kudos/presentation/components/KudosList';
import { User } from '../../../userManagement/presentation/components/UserListItem';

// Mock data for the admin dashboard
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
  {
    id: '3',
    recipient: 'Alex Chen',
    team: 'API',
    category: 'Helping Hand',
    message:
      'Alex helped me understand the product requirements and was always available to answer my questions. His patience and knowledge made onboarding so much easier!',
    from: {
      name: 'Emily Davis',
      date: 'May 5, 2023',
    },
    likes: 2,
    comments: 0,
  },
];

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

const mockLeads: User[] = [
  {
    id: '4',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    role: 'tech_lead',
  },
  {
    id: '5',
    name: 'Sam Taylor',
    email: 'sam.taylor@example.com',
    role: 'tech_lead',
  },
];

// Using Record<string, never> for an empty props interface to satisfy the linter
type AdminDashboardViewProps = Record<string, never>;

const AdminDashboardView: React.FC<AdminDashboardViewProps> = () => {
  const handlePromoteUser = (userId: string) => {
    console.log('Promoting user:', userId);
    // In a real app, this would make an API call to update the user role
  };

  const handleDemoteLead = (leadId: string) => {
    console.log('Demoting lead:', leadId);
    // In a real app, this would make an API call to update the lead role
  };

  const handleEditUser = (userId: string) => {
    console.log('Editing user:', userId);
    // In a real app, this would open a form to edit the user
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Deleting user:', userId);
    // In a real app, this would make an API call to delete the user
  };

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
        <p className='text-gray-600'>Manage users, leads, and view all kudos.</p>
      </div>

      <AdminTabs
        kudos={mockKudos}
        users={mockUsers}
        leads={mockLeads}
        onPromoteUser={handlePromoteUser}
        onDemoteLead={handleDemoteLead}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default AdminDashboardView;
