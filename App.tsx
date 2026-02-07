import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowLeft, Share, Check, Copy } from 'lucide-react';
import { Editor } from 'tldraw';
import { RoomProvider, useOthers, useStatus } from './liveblocks.config';
import { AvatarGroup } from './components/AvatarGroup';
import { FloatingToolbar } from './components/FloatingToolbar';
import { FollowMeToggle } from './components/FollowMeToggle';
import { CanvasWrapper } from './components/CanvasWrapper';
import { ToastProvider, useToast } from './components/Toast';
import { User } from './types';
import { nanoid } from 'nanoid';

// 随机用户颜色
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4'];
const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
const randomName = () => `User_${nanoid(4)}`;

// 从 URL 获取房间 ID
function getRoomId(): string {
  const params = new URLSearchParams(window.location.search);
  let roomId = params.get('room');
  
  if (!roomId) {
    roomId = nanoid(10);
    // 更新 URL，不刷新页面
    const newUrl = `${window.location.pathname}?room=${roomId}`;
    window.history.replaceState({}, '', newUrl);
  }
  
  return roomId;
}

// 获取分享链接
function getShareUrl(roomId: string): string {
  return `${window.location.origin}${window.location.pathname}?room=${roomId}`;
}

// 连接状态指示器
function ConnectionStatus() {
  const status = useStatus();
  console.log('[ConnectionStatus] Current status:', status);
  
  const statusConfig: Record<string, { color: string; text: string }> = {
    initial: { color: 'bg-gray-400', text: '初始化...' },
    connecting: { color: 'bg-yellow-500', text: '连接中...' },
    connected: { color: 'bg-green-500', text: '已连接' },
    reconnecting: { color: 'bg-yellow-500', text: '重连中...' },
    disconnected: { color: 'bg-red-500', text: '已断开' },
  };
  const config = statusConfig[status] || { color: 'bg-gray-400', text: status };
  
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <span className={`w-2 h-2 rounded-full ${config.color}`} />
      <span>{config.text}</span>
    </div>
  );
}

// 在线用户头像（从 Liveblocks 获取）
function LiveAvatarGroup() {
  const others = useOthers();
  const users: User[] = others.map(({ connectionId, info, presence }) => ({
    id: String(connectionId),
    name: info?.name || presence?.name || 'Anonymous',
    color: info?.color || presence?.color || '#6366f1',
    avatarUrl: info?.avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${connectionId}`,
  }));
  
  // 添加当前用户占位
  const allUsers: User[] = [
    { id: 'me', name: 'You', color: '#6366f1', avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=me' },
    ...users,
  ];
  
  return <AvatarGroup users={allUsers} max={4} />;
}

// 主编辑器内容
function EditorContent({ roomId }: { roomId: string }) {
  const [activeTool, setActiveTool] = useState('select');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const others = useOthers();
  const prevOthersRef = useRef<number[]>([]);

  // 监听用户加入/离开
  useEffect(() => {
    const currentIds = others.map(o => o.connectionId);
    const prevIds = prevOthersRef.current;
    
    // 新加入的用户
    currentIds.forEach(id => {
      if (!prevIds.includes(id)) {
        const user = others.find(o => o.connectionId === id);
        const name = user?.info?.name || user?.presence?.name || 'Someone';
        showToast(`${name} 加入了房间`, 'info');
      }
    });
    
    // 离开的用户
    prevIds.forEach(id => {
      if (!currentIds.includes(id)) {
        showToast(`有用户离开了房间`, 'info');
      }
    });
    
    prevOthersRef.current = currentIds;
  }, [others, showToast]);

  // 复制分享链接
  const handleShare = useCallback(async () => {
    const shareUrl = getShareUrl(roomId);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 备用方案
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [roomId]);

  // Sync editor tool state with our UI
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const currentTool = editor.getCurrentToolId();
      // Map tldraw tools to our UI IDs if they differ slightly
      // Tldraw: 'select', 'hand', 'draw', 'geo', 'note'
      // Our UI: 'select', 'hand', 'draw', 'shape', 'note', 'image'
      
      let mappedTool = currentTool;
      if (currentTool === 'geo') mappedTool = 'shape';
      
      setActiveTool(mappedTool);
    };

    // Listen to editor store changes
    const unsubscribeStore = editor.store.listen(handleChange, { scope: 'document', source: 'user' });
    
    // Listen to editor events using sideEffects
    const cleanupSideEffect = editor.sideEffects.registerAfterChangeHandler('instance', handleChange);

    return () => {
      cleanupSideEffect();
      unsubscribeStore();
    };
  }, [editor]);

  const handleToolSelect = (toolId: string) => {
    if (!editor) return;

    setActiveTool(toolId);

    switch (toolId) {
      case 'select':
        editor.setCurrentTool('select');
        break;
      case 'hand':
        editor.setCurrentTool('hand');
        break;
      case 'draw':
        editor.setCurrentTool('draw');
        break;
      case 'shape':
        editor.setCurrentTool('geo');
        break;
      case 'note':
        editor.setCurrentTool('note');
        break;
      case 'image':
        // For now, simulate inserting an image by just creating a placeholder
        editor.createShape({
            type: 'geo',
            x: editor.getViewportScreenCenter().x - 100,
            y: editor.getViewportScreenCenter().y - 75,
            props: {
                geo: 'rectangle',
                w: 200,
                h: 150,
                text: 'Image Placeholder',
                fill: 'pattern'
            }
        });
        editor.setCurrentTool('select');
        break;
      default:
        editor.setCurrentTool('select');
    }
  };

  return (
    <div className="relative w-full h-screen bg-bg-light bg-dot-pattern overflow-hidden text-slate-900 selection:bg-blue-100 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="flex items-center justify-center w-10 h-10 rounded-xl glass-panel text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-slate-900 leading-tight drop-shadow-sm">Q3 Brainstorming</h1>
            <ConnectionStatus />
          </div>
        </div>

        {/* Right Side: Avatars & Share */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="glass-panel px-2 py-1.5 rounded-full shadow-sm">
            <LiveAvatarGroup />
          </div>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 font-semibold text-sm"
          >
            {copied ? <Check size={16} strokeWidth={2.5} /> : <Share size={16} strokeWidth={2.5} />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Workspace */}
      <main className="absolute inset-0 z-0">
        <CanvasWrapper onEditorMount={setEditor} />
      </main>

      {/* Floating UI Elements */}
      <FollowMeToggle editor={editor} />
      <FloatingToolbar activeTool={activeTool} onToolSelect={handleToolSelect} editor={editor} />
      
    </div>
  );
}

// 主应用入口（包裹 RoomProvider）
export default function App() {
  // 获取房间 ID（从 URL 或生成新 ID）
  const roomId = useMemo(() => getRoomId(), []);
  
  // 生成稳定的用户信息
  const userInfo = useMemo(() => ({
    name: randomName(),
    color: randomColor(),
  }), []);

  return (
    <ToastProvider>
      <RoomProvider
        id={`livesyncdesk-${roomId}`}
        initialPresence={{
          cursor: null,
          name: userInfo.name,
          color: userInfo.color,
        }}
        initialStorage={{}}
      >
        <EditorContent roomId={roomId} />
      </RoomProvider>
    </ToastProvider>
  );
}