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
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl"
        style={{ width: '90%', maxWidth: '400px', padding: '24px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}>
              <Sparkles size={20} color="#6366f1" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>AI 生成便签</h2>
          </div>
          <button 
            onClick={onClose}
            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        {/* 主题输入 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
            主题 / 关键词
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：产品上线前的准备工作"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 数量选择 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
            生成数量
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[3, 5, 8].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: count === n ? '#6366f1' : '#f1f5f9',
                  color: count === n ? '#fff' : '#475569',
                }}
              >
                {n} 个
              </button>
            ))}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{ fontSize: '14px', color: '#ef4444', backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: '#475569',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '12px',
              border: 'none',
              background: loading || !topic.trim() ? '#a5b4fc' : '#6366f1',
              color: '#fff',
              fontWeight: 500,
              fontSize: '14px',
              cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                生成
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
