import React from 'react';
import { Editor } from 'tldraw';
import { 
  MousePointer2, 
  Hand, 
  PenTool, 
  Square, 
  StickyNote, 
  Image as ImageIcon, 
  Plus,
  Undo2,
  Redo2
} from 'lucide-react';

interface FloatingToolbarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  editor: Editor | null;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ activeTool, onToolSelect, editor }) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Pan' },
    { id: 'draw', icon: PenTool, label: 'Draw' },
    { id: 'shape', icon: Square, label: 'Shape' },
    { id: 'note', icon: StickyNote, label: 'Note' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
  ];

  const canUndo = editor?.getCanUndo() ?? false;
  const canRedo = editor?.getCanRedo() ?? false;

  const handleUndo = () => {
    if (editor && canUndo) {
      editor.undo();
    }
  };

  const handleRedo = () => {
    if (editor && canRedo) {
      editor.redo();
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 pointer-events-none">
      
      {/* Undo/Redo Group */}
      <div className="pointer-events-auto flex items-center glass-panel shadow-float rounded-2xl p-1.5 gap-1">
        <button 
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-3 rounded-xl transition-colors ${
            canUndo 
              ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="撤销 (Ctrl+Z)"
        >
          <Undo2 size={20} />
        </button>
        <button 
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-3 rounded-xl transition-colors ${
            canRedo 
              ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="重做 (Ctrl+Shift+Z)"
        >
          <Redo2 size={20} />
        </button>
      </div>

      {/* Main Tools Group */}
      <div className="pointer-events-auto flex items-center glass-panel shadow-float rounded-2xl p-2 gap-1">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          const Icon = tool.icon;
          
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`group relative p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-500 hover:bg-black/5 hover:text-slate-900'
              }`}
              title={tool.label}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
        
        <div className="w-px h-8 bg-slate-200 mx-2" />
        
        <button className="flex items-center justify-center w-11 h-11 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};