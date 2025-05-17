import React from 'react';
import Card from '@/components/atoms/Card';

interface KudosCardProps {
  recipient: string;
  team: string;
  category: string;
  message: string;
  from: {
    name: string;
    date: string;
  };
  likes?: number;
  comments?: number;
  className?: string;
}

const KudosCard: React.FC<KudosCardProps> = ({
  recipient,
  team,
  category,
  message,
  from,
  likes = 0,
  comments = 0,
  className = '',
}) => {
  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      'Helping Hand': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Well Done': { bg: 'bg-green-100', text: 'text-green-800' },
      'Great Teamwork': { bg: 'bg-green-100', text: 'text-green-800' },
      'Proud of You': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Outstanding Achievement': { bg: 'bg-red-100', text: 'text-red-800' },
      'Brilliant Idea': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Amazing Support': { bg: 'bg-teal-100', text: 'text-teal-800' },
      Innovation: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    };

    return styles[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const categoryStyle = getCategoryStyle(category);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className='mb-4'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-bold text-lg text-gray-900'>{recipient}</h3>
            <p className='text-gray-500 text-sm'>{team}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
            {category}
          </span>
        </div>
      </div>

      <p className='text-gray-700 mb-4'>{message}</p>

      <div className='pt-4 border-t border-gray-100'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-1'>
            <svg
              className='w-4 h-4 text-gray-400'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' />
            </svg>
            <span className='text-sm text-gray-500'>From: {from.name}</span>
          </div>
          <span className='text-sm text-gray-500'>{from.date}</span>
        </div>

        <div className='flex mt-4 space-x-6'>
          <button className='flex items-center text-gray-500 hover:text-purple-500'>
            <svg
              className='w-4 h-4 mr-1'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5'
              />
            </svg>
            <span>{likes}</span>
          </button>

          <button className='flex items-center text-gray-500 hover:text-purple-500'>
            <svg
              className='w-4 h-4 mr-1'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
              />
            </svg>
            <span>{comments}</span>
          </button>

          <button className='flex items-center text-gray-500 hover:text-purple-500 ml-auto'>
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
              />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default KudosCard;
