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

// API response interface matching the raw response format
export interface KudoCardResponse {
  id: string;
  message: string;
  recipientName: string;
  giverId: string;
  giverEmail: string;
  teamId: string;
  teamName: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  giverName: string;
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
  kudos: (Kudos | LegacyKudos | KudoCardResponse)[];
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
const isLegacyKudos = (kudos: Kudos | LegacyKudos | KudoCardResponse): kudos is LegacyKudos => {
  return typeof (kudos as LegacyKudos).recipient === 'string';
};

// Type guard to check if a kudos object is API response format
const isKudoCardResponse = (kudos: Kudos | LegacyKudos | KudoCardResponse): kudos is KudoCardResponse => {
  return (kudos as KudoCardResponse).recipientName !== undefined;
};

const KudosList: React.FC<KudosListProps> = ({ kudos: rawKudos, className = '' }) => {
  const kudos = rawKudos.map((kudo, index) => {
    if (!isLegacyKudos(kudo) && !isKudoCardResponse(kudo)) {
      return { ...kudo, index };
    }

    // If it's the KudoCardResponse format from API
    if (isKudoCardResponse(kudo)) {
      return {
        id: kudo.id,
        recipient: {
          name: kudo.recipientName,
          avatar: getAvatar(kudo.recipientName),
          department: kudo.teamName || kudo.teamId,
        },
        category: kudo.categoryName || kudo.categoryId,
        message: kudo.message,
        from: {
          name: kudo.giverName || 'Anonymous',
          avatar: getAvatar(kudo.giverName || kudo.giverId),
        },
        date: new Date(kudo.createdAt).toLocaleDateString(),
        likes: 0, // Default values
        comments: 0, // Default values
        index,
      };
    }

    // Transform from old legacy format to new format
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

  console.log(kudos[0], 'kudos');
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
