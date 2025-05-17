import React from 'react';
import Button from '../../../../components/atoms/Button';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'team_member' | 'tech_lead' | 'admin';
}

interface UserListItemProps {
  user: User;
  onPromote?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onPromote, onEdit, onDelete }) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'team_member':
        return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>Team Member</span>;
      case 'tech_lead':
        return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>Tech Lead</span>;
      case 'admin':
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
          {user.role === 'team_member' && onPromote && (
            <Button variant='secondary' size='sm' onClick={() => onPromote(user.id)}>
              Promote to Lead
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
