import React, { useState } from 'react';
import UserListItem, { User } from './UserListItem';

interface UserListTableProps {
  users: User[];
  onPromote?: (userId: string) => void;
  onDemote?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

const UserListTable: React.FC<UserListTableProps> = ({ users, onPromote, onDemote, onEdit, onDelete }) => {
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  const handleRoleChange = async (userId: string, action: 'promote' | 'demote') => {
    setLoadingUsers((prev) => ({ ...prev, [userId]: true }));
    try {
      if (action === 'promote' && onPromote) {
        await onPromote(userId);
      } else if (action === 'demote' && onDemote) {
        await onDemote(userId);
      }
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (users.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500'>No users found.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    User
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Role
                  </th>
                  <th scope='col' className='relative px-6 py-3'>
                    <span className='sr-only'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {users.map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    onPromote={() => handleRoleChange(user.id, 'promote')}
                    onDemote={() => handleRoleChange(user.id, 'demote')}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isLoading={loadingUsers[user.id] || false}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListTable;
