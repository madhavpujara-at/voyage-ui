import React from 'react';

// Define sticky note background colors
const stickyNoteColors = [
  ['bg-yellow-100', 'bg-yellow-50'],
  ['bg-green-100', 'bg-green-50'],
  ['bg-blue-100', 'bg-blue-50'],
  ['bg-pink-100', 'bg-pink-50'],
  ['bg-purple-100', 'bg-purple-50'],
  ['bg-orange-100', 'bg-orange-50'],
];

// Category badge styles for various recognition types
const categoryStyles: Record<string, string> = {
  'Brilliant Idea': 'bg-blue-500 text-white',
  'Great Teamwork': 'bg-green-500 text-white',
  'Problem Solver': 'bg-pink-500 text-white',
  'Customer Hero': 'bg-purple-500 text-white',
  'Going Above & Beyond': 'bg-purple-500 text-white',
  Innovation: 'bg-indigo-500 text-white',
};

interface UserInfo {
  name: string;
  avatar?: string;
  department?: string;
  role?: string;
}

export interface Kudos {
  id: string | number;
  recipient: UserInfo;
  from: UserInfo;
  message: string;
  category: string;
  date: string;
  likes?: number;
  comments?: number;
  index?: number; // Optional index that might be passed from the parent
}

interface KudosCardProps {
  kudos: Kudos;
  index: number;
  className?: string;
}

const KudosCard: React.FC<KudosCardProps> = ({ kudos, index = 0, className = '' }) => {
  // Guard against missing kudos object
  if (!kudos) {
    console.error('KudosCard rendered without a kudos object!');
    return null;
  }

  // Get background colors based on index
  const [bodyColor, headerColor] = stickyNoteColors[index % stickyNoteColors.length];

  // Generate a random slight rotation (-1, 0, or 1 degree)
  const rotateDeg = Math.floor(Math.random() * 3) - 1;

  // Get category badge style (or default to gray if not found)
  const categoryBadgeStyle = categoryStyles[kudos.category] || 'bg-gray-500 text-white';

  return (
    <div
      className={`rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${bodyColor} ${className}`}
      style={{
        transform: `rotate(${rotateDeg}deg)`,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Header section with recipient info and category */}
      <div className={`p-4 ${headerColor} rounded-t-lg`}>
        <div className='flex items-start'>
          {kudos.recipient.avatar && (
            <img
              src={kudos.recipient.avatar}
              alt={kudos.recipient.name}
              className='h-12 w-12 rounded-full object-cover border-2 border-white shadow-md mr-3'
            />
          )}
          <div className='flex-1'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='font-bold text-lg text-gray-900'>{kudos.recipient.name}</h3>
                <p className='text-gray-500 text-sm'>
                  {kudos.recipient.department || ''}
                  {kudos.recipient.role && ` • ${kudos.recipient.role}`}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryBadgeStyle}`}>
                {kudos.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message body */}
      <div className='p-5'>
        <p className='text-gray-700 mb-4'>{kudos.message}</p>
      </div>

      {/* Footer with sender info and date */}
      <div className='px-5 pb-4 pt-2 border-t border-gray-200 flex justify-between items-center'>
        <div className='flex items-center'>
          {kudos.from.avatar && (
            <img
              src={kudos.from.avatar}
              alt={kudos.from.name}
              className='h-6 w-6 rounded-full object-cover border border-gray-200 shadow-sm mr-2'
            />
          )}
          <span className='text-sm text-gray-600'>From: {kudos.from.name}</span>
        </div>
        <span className='text-sm text-gray-500'>{kudos.date}</span>
      </div>
    </div>
  );
};

export default KudosCard;
