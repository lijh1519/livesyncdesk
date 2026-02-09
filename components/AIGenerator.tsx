import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { generateBrainstormNotes } from '../services/ai';

interface AIGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (notes: string[]) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ isOpen, onClose, onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('请输入主题');
      return;
    }

    setLoading(true);
    setError('');

    const result = await generateBrainstormNotes(topic, count);

    setLoading(false);

    if (result.success && result.notes && result.notes.length > 0) {
      onGenerate(result.notes);
      setTopic('');
      onClose();
    } else {
      setError(result.error || '生成失败，请重试');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">AI 生成便签</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              主题 / 关键词
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：产品上线前的准备工作"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              生成数量
            </label>
            <div className="flex gap-2">
              {[3, 5, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    count === n
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  disabled={loading}
                >
                  {n} 个
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
            disabled={loading}
          >
            取消
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                生成
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
