import React from 'react';
import { MoreHorizontal, Trash2, Copy } from 'lucide-react';

interface ImageCardProps {
  src: string;
  title: string;
  position: { x: number; y: number };
  rotation: number;
}

export const ImageCard: React.FC<ImageCardProps> = ({ src, title, position, rotation }) => {
  return (
    <div
      className="absolute w-64 bg-white p-3 pb-4 shadow-float rounded-xl border border-slate-100 group cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform"
      style={{
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="w-full h-40 bg-gray-50 rounded-lg mb-3 overflow-hidden relative">
        <img src={src} alt={title} className="w-full h-full object-cover" />
      </div>
      
      <div className="px-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reference</p>
        <p className="text-sm font-bold text-slate-800">{title}</p>
      </div>

      {/* Hover Actions */}
      <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
        <button className="p-2.5 bg-white shadow-md border border-slate-100 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Copy size={16} />
        </button>
        <button className="p-2.5 bg-white shadow-md border border-slate-100 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};