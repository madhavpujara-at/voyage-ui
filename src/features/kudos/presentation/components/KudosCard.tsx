import React, { useMemo } from 'react';

// Define sticky note background colors with more teal variations
const stickyNoteColors = [
  ['bg-yellow-100', 'bg-yellow-50'],
  ['bg-green-100', 'bg-green-50'],
  ['bg-blue-100', 'bg-blue-50'],
  ['bg-teal-100', 'bg-teal-50'],
  ['bg-cyan-100', 'bg-cyan-50'],
  ['bg-orange-100', 'bg-orange-50'],
];

// Category badge styles for various recognition types, using teal as a primary color
const categoryStyles: Record<string, string> = {
  'Brilliant Idea': 'bg-teal-600 text-white',
  'Great Teamwork': 'bg-green-600 text-white',
  'Problem Solver': 'bg-cyan-600 text-white',
  'Customer Hero': 'bg-teal-500 text-white',
  'Going Above & Beyond': 'bg-teal-700 text-white',
  Innovation: 'bg-teal-600 text-white',
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
  // Use useMemo to ensure the random values don't change on re-renders
  // Moved outside conditional check to avoid React hook rules issues
  const { rotateStyle, originX, originY } = useMemo(() => {
    // Generate random rotation between -4 and 4 degrees
    // Using a different approach to ensure more variety
    const rotateValue = (Math.random() * 8 - 4).toFixed(1);

    // Generate random transform origin points
    // This makes the cards rotate from different points for more natural look
    const originXValue = 40 + Math.random() * 20; // 40-60% (center-ish, but varied)
    const originYValue = 40 + Math.random() * 20; // 40-60%

    return {
      rotateStyle: `rotate(${rotateValue}deg)`,
      originX: `${originXValue}%`,
      originY: `${originYValue}%`,
    };
  }, []);

  // Guard against missing kudos object
  if (!kudos) {
    console.error('KudosCard rendered without a kudos object!');
    return null;
  }

  // Get background colors based on index
  const [bodyColor, headerColor] = stickyNoteColors[index % stickyNoteColors.length];

  // Get category badge style (or default to teal if not found)
  const categoryBadgeStyle = categoryStyles[kudos.category] || 'bg-teal-500 text-white';

  return (
    <div
      className={`rounded-lg shadow-[rgba(0,0,0,0.15)_2.4px_2.4px_3.2px] hover:shadow-[rgba(0,0,0,0.25)_0px_8px_16px] transition-all duration-300 ${bodyColor} ${className}`}
      style={{
        transform: rotateStyle,
        transformOrigin: `${originX} ${originY}`,
        animationDelay: `${index * 0.05}s`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header section with recipient info and category */}
      <div
        className={`p-4 ${headerColor} rounded-t-lg border-b border-gray-200`}
        style={{
          boxShadow: 'inset 0px -2px 3px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryBadgeStyle} shadow-sm`}>
                {kudos.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message body */}
      <div className='p-5 relative'>
        <p className='text-gray-700 mb-4 relative z-10'>{kudos.message}</p>

        {/* Subtle texture overlay for paper effect */}
        <div className='absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-10 pointer-events-none'></div>
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
