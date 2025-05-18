import React, { useState } from 'react';
import KudosList, { Kudos } from '../../../kudos/presentation/components/KudosList';
import UserListTable from '../../../userManagement/presentation/components/UserListTable';
import { User } from '../../../userManagement/presentation/components/UserListItem';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => {
  return (
    <button
      className={`py-2 px-4 font-medium text-sm border-b-2 focus:outline-none ${
        isActive
          ? 'border-purple-500 text-purple-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface AdminTabsProps {
  kudos: Kudos[];
  users: User[];
  leads: User[];
  onPromoteUser?: (userId: string) => void;
  onDemoteLead?: (leadId: string) => void;
  onEditUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  kudos,
  users,
  leads,
  onPromoteUser,
  onDemoteLead,
  onEditUser,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState('kudos');

  return (
    <div>
      <div className='border-b border-gray-200'>
        <div className='flex'>
          <TabButton isActive={activeTab === 'kudos'} onClick={() => setActiveTab('kudos')}>
            Kudos Overview
          </TabButton>
          <TabButton isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            Team Members
          </TabButton>
          <TabButton isActive={activeTab === 'leads'} onClick={() => setActiveTab('leads')}>
            Tech Leads
          </TabButton>
        </div>
      </div>

      <div className='py-6'>
        {activeTab === 'kudos' && (
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>All Kudos</h2>
            <KudosList kudos={kudos} />
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Team Members</h2>
            <UserListTable users={users} onPromote={onPromoteUser} onEdit={onEditUser} onDelete={onDeleteUser} />
          </div>
        )}

        {activeTab === 'leads' && (
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Tech Leads</h2>
            <UserListTable users={leads} onDemote={onDemoteLead} onEdit={onEditUser} onDelete={onDeleteUser} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTabs;
