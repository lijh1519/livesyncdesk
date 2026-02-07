import React from 'react';
import { Pin } from 'lucide-react';
import { StickyNoteData } from '../types';

interface StickyNoteProps {
  data: StickyNoteData;
}

const colorMap = {
  yellow: 'bg-[#fff7d1] text-slate-800',
  blue: 'bg-[#e0f2fe] text-slate-700',
  green: 'bg-[#dcfce7] text-slate-800',
  pink: 'bg-[#fce7f3] text-slate-800',
};

export const StickyNote: React.FC<StickyNoteProps> = ({ data }) => {
  return (
    <div 
      className={`absolute w-56 p-5 shadow-lg ${colorMap[data.color]} rounded-sm flex flex-col gap-3 transition-transform hover:scale-105 hover:shadow-xl cursor-grab active:cursor-grabbing group`}
      style={{
        left: data.position.x,
        top: data.position.y,
        transform: `rotate(${data.rotation}deg)`,
      }}
    >
      <div className="flex justify-between items-start opacity-60 group-hover:opacity-100 transition-opacity">
        <Pin size={16} className="text-yellow-700/50 fill-yellow-700/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-blue-400/60" />
      </div>
      
      <p className="font-medium text-lg leading-snug font-handwriting">
        {data.content}
      </p>
      
      <div className="mt-auto pt-2 flex items-center gap-2">
        <img 
          src={data.author.avatarUrl} 
          alt={data.author.name}
          className="w-6 h-6 rounded-full object-cover border border-black/5" 
        />
        <span className="text-xs font-semibold opacity-60">{data.author.name}</span>
      </div>
    </div>
  );
};