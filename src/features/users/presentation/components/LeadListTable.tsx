import React from 'react';
import LeadListItem from './LeadListItem';
import { User } from './UserListItem';

interface LeadListTableProps {
  leads: User[];
  onDemote?: (leadId: string) => void;
  onEdit?: (leadId: string) => void;
  onDelete?: (leadId: string) => void;
}

const LeadListTable: React.FC<LeadListTableProps> = ({ leads, onDemote, onEdit, onDelete }) => {
  if (leads.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500'>No tech leads found.</p>
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
                    Lead
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
                {leads.map((lead) => (
                  <LeadListItem key={lead.id} lead={lead} onDemote={onDemote} onEdit={onEdit} onDelete={onDelete} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadListTable;
