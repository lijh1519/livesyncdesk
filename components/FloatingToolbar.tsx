import React, { useState, useEffect } from 'react';
import { Editor } from 'tldraw';
import { 
  MousePointer2, 
  Hand, 
  PenTool, 
  Square, 
  StickyNote, 
  Image as ImageIcon, 
  Sparkles,
  Undo2,
  Redo2,
  Trash2
} from 'lucide-react';

interface FloatingToolbarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  editor: Editor | null;
  onAIClick?: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ activeTool, onToolSelect, editor, onAIClick }) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setCanUndo(editor.getCanUndo());
      setCanRedo(editor.getCanRedo());
      setHasSelection(editor.getSelectedShapes().length > 0);
    };

    update();
    const unsub = editor.store.listen(update, { scope: 'all' });
    // Also listen for selection changes
    const interval = setInterval(update, 300);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [editor]);

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'hand', icon: Hand, label: 'Pan' },
    { id: 'draw', icon: PenTool, label: 'Draw' },
    { id: 'shape', icon: Square, label: 'Shape' },
    { id: 'note', icon: StickyNote, label: 'Note' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
  ];

  const handleUndo = () => {
    if (editor) editor.undo();
  };

  const handleRedo = () => {
    if (editor) editor.redo();
  };

  const handleDelete = () => {
    if (editor && hasSelection) {
      editor.deleteShapes(editor.getSelectedShapeIds());
    }
  };

  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4 z-50 pointer-events-none max-w-[calc(100vw-24px)]">
      
      {/* Undo/Redo/Delete Group */}
      <div className="pointer-events-auto hidden sm:flex items-center glass-panel shadow-float rounded-xl sm:rounded-2xl p-1 sm:p-1.5 gap-0.5 sm:gap-1">
        <button 
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${
            canUndo 
              ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="撤销 (Ctrl+Z)"
        >
          <Undo2 size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button 
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${
            canRedo 
              ? 'text-slate-500 hover:text-slate-900 hover:bg-black/5' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="重做 (Ctrl+Shift+Z)"
        >
          <Redo2 size={18} className="sm:w-5 sm:h-5" />
        </button>
        <button 
          onClick={handleDelete}
          disabled={!hasSelection}
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${
            hasSelection 
              ? 'text-red-400 hover:text-red-600 hover:bg-red-50' 
              : 'text-slate-300 cursor-not-allowed'
          }`}
          title="删除选中 (Delete)"
        >
          <Trash2 size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Main Tools Group */}
      <div className="pointer-events-auto flex items-center glass-panel shadow-float rounded-xl sm:rounded-2xl p-1 sm:p-2 gap-0.5 sm:gap-1 overflow-x-auto">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          const Icon = tool.icon;
          
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`group relative p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-shrink-0 ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-500 hover:bg-black/5 hover:text-slate-900'
              }`}
              title={tool.label}
            >
              <Icon size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
        
        <div className="w-px h-6 sm:h-8 bg-slate-200 mx-1 sm:mx-2 flex-shrink-0" />
        
        <button 
          onClick={onAIClick}
          className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-r from-purple-500 to-primary hover:from-purple-600 hover:to-primary-hover text-white rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          title="AI 生成便签"
        >
          <Sparkles size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};