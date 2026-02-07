import React from 'react';
import { User } from '../types';

interface AvatarGroupProps {
  users: User[];
  max?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 3 }) => {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-3">
      {visibleUsers.map((user) => (
        <div 
          key={user.id} 
          className="relative group cursor-pointer transition-transform hover:z-10 hover:scale-105"
        >
          <div 
            className={`w-9 h-9 rounded-full border-[2px] border-white shadow-sm overflow-hidden bg-gray-200 ring-2 ring-offset-1 ring-offset-transparent ring-${user.color}-400/30`}
          >
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* Tooltip */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            {user.name}
          </div>
        </div>
      ))}
      
      {remaining > 0 && (
        <div className="flex items-center justify-center w-9 h-9 rounded-full border-[2px] border-white bg-gray-100 text-gray-500 text-xs font-bold shadow-sm z-0">
          +{remaining}
        </div>
      )}
    </div>
  );
};