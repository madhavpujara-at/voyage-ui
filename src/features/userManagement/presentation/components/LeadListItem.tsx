import React from 'react';
import Button from '../../../../components/atoms/Button';
import { User } from './UserListItem';

interface LeadListItemProps {
  lead: User;
  onDemote?: (leadId: string) => void;
  onEdit?: (leadId: string) => void;
  onDelete?: (leadId: string) => void;
}

const LeadListItem: React.FC<LeadListItemProps> = ({ lead, onDemote }) => {
  return (
    <tr className='hover:bg-gray-50'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center'>
            <span className='text-sm font-medium text-gray-700'>{lead.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>{lead.name}</div>
            <div className='text-sm text-gray-500'>{lead.email}</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>Tech Lead</span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <div className='flex justify-end gap-2'>
          {onDemote && (
            <Button variant='secondary' size='sm' onClick={() => onDemote(lead.id)}>
              Demote to Team Member
            </Button>
          )}
          {/* {onEdit && (
            <Button variant='secondary' size='sm' onClick={() => onEdit(lead.id)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant='secondary' size='sm' onClick={() => onDelete(lead.id)}>
              Delete
            </Button>
          )} */}
        </div>
      </td>
    </tr>
  );
};

export default LeadListItem;
