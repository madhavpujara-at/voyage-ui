import React from 'react';
import KudosCard from './KudosCard';

export interface Kudos {
  id: string;
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
}

interface KudosListProps {
  kudos: Kudos[];
  className?: string;
}

const KudosList: React.FC<KudosListProps> = ({ kudos, className = '' }) => {
  if (kudos.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500'>No kudos found. Be the first to recognize a colleague!</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {kudos.map((kudo) => (
        <KudosCard
          key={kudo.id}
          recipient={kudo.recipient}
          team={kudo.team}
          category={kudo.category}
          message={kudo.message}
          from={kudo.from}
          likes={kudo.likes}
          comments={kudo.comments}
        />
      ))}
    </div>
  );
};

export default KudosList;
