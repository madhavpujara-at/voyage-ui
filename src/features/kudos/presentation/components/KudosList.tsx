import React from 'react';
import KudosCard from './KudosCard';

interface UserInfo {
  name: string;
  avatar?: string;
  department?: string;
  role?: string;
}

export interface Kudos {
  id: string;
  recipient: UserInfo;
  message: string;
  category: string;
  from: UserInfo;
  date: string;
  likes?: number;
  comments?: number;
}

// For backward compatibility with old kudos format
interface LegacyKudos {
  id: string;
  recipient: string;
  team?: string;
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
  kudos: (Kudos | LegacyKudos)[];
  className?: string;
}

// Temporary placeholder avatars (you should replace these with actual user avatars)
const AVATAR_PLACEHOLDERS: Record<string, string> = {
  'Jane Smith': 'https://ui-avatars.com/api/?name=Jane+Smith&background=f59e0b&color=fff',
  'David Lee': 'https://ui-avatars.com/api/?name=David+Lee&background=10b981&color=fff',
  'Alex Chen': 'https://ui-avatars.com/api/?name=Alex+Chen&background=3b82f6&color=fff',
  'Emily Davis': 'https://ui-avatars.com/api/?name=Emily+Davis&background=ec4899&color=fff',
  'Sarah Williams': 'https://ui-avatars.com/api/?name=Sarah+Williams&background=8b5cf6&color=fff',
  'Michael Johnson': 'https://ui-avatars.com/api/?name=Michael+Johnson&background=6366f1&color=fff',
};

const getAvatar = (name: string): string => {
  return (
    AVATAR_PLACEHOLDERS[name] ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
  );
};

// Type guard to check if a kudos object is legacy format
const isLegacyKudos = (kudos: Kudos | LegacyKudos): kudos is LegacyKudos => {
  return typeof kudos.recipient === 'string';
};

const KudosList: React.FC<KudosListProps> = ({ kudos: rawKudos, className = '' }) => {
  // Transform the incoming kudos data to match our new structure
  const kudos = rawKudos.map((kudo, index) => {
    // If it's already in the new format, just return it with index
    if (!isLegacyKudos(kudo)) {
      return { ...kudo, index };
    }

    // Transform from old format to new format
    return {
      id: kudo.id,
      recipient: {
        name: kudo.recipient,
        avatar: getAvatar(kudo.recipient),
        department: kudo.team,
        role: undefined, // We don't have role data in the old format
      },
      category: kudo.category,
      message: kudo.message,
      from: {
        name: kudo.from.name,
        avatar: getAvatar(kudo.from.name),
      },
      date: kudo.from.date,
      likes: kudo.likes,
      comments: kudo.comments,
      index,
    };
  });

  if (kudos.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500'>No kudos found. Be the first to recognize a colleague!</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {kudos.map((kudo, index) => (
        <KudosCard key={kudo.id} kudos={kudo} index={index} />
      ))}
    </div>
  );
};

export default KudosList;
