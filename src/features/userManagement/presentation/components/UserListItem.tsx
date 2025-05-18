import React from 'react';
import Button from '../../../../components/atoms/Button';
import { UserRole } from '@/features/userManagement/domain/entities/User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserListItemProps {
  user: User;
  onPromote?: (userId: string) => void;
  onDemote?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  isLoading?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onPromote, onDemote, isLoading = false }) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case UserRole.TEAM_MEMBER:
        return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>Team Member</span>;
      case UserRole.TECH_LEAD:
        return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>Tech Lead</span>;
      case UserRole.ADMIN:
        return <span className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800'>Admin</span>;
      default:
        return null;
    }
  };

  return (
    <tr className='hover:bg-gray-50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center'>
            <span className='text-sm font-medium text-gray-700'>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>{user.name}</div>
            <div className='text-sm text-gray-500'>{user.email}</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div>{getRoleBadge(user.role)}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <div className='flex justify-end gap-2'>
          {user.role === UserRole.TEAM_MEMBER && onPromote && (
            <Button variant='secondary' size='sm' onClick={() => onPromote(user.id)} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Promote to Lead'}
            </Button>
          )}
          {user.role === UserRole.TECH_LEAD && onDemote && (
            <Button variant='secondary' size='sm' onClick={() => onDemote(user.id)} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Demote to Member'}
            </Button>
          )}
          {/* {onEdit && (
            <Button variant='secondary' size='sm' onClick={() => onEdit(user.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant='secondary' size='sm' onClick={() => onDelete(user.id)}>
              Delete
            </Button>
          )} */}
        </div>
      </td>
    </tr>
  );
};

export default UserListItem;
