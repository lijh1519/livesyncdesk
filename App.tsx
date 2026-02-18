import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowLeft, Share, Check, Copy, LogOut } from 'lucide-react';
import { Editor, createShapeId } from 'tldraw';
import { RoomProvider, useOthers, useStatus } from './liveblocks.config';
import { AvatarGroup } from './components/AvatarGroup';
import { FloatingToolbar } from './components/FloatingToolbar';
import { FollowMeToggle } from './components/FollowMeToggle';
import { CanvasWrapper } from './components/CanvasWrapper';
import { ToastProvider, useToast } from './components/Toast';
import { AIGenerator } from './components/AIGenerator';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { User } from './types';
import { nanoid } from 'nanoid';

// Paddle 类型声明
declare global {
  interface Window {
    Paddle: {
      Environment: {
        set: (env: 'sandbox' | 'production') => void;
      };
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, string>;
          customer?: { email?: string };
        }) => void;
      };
    };
  }
}

// Paddle 配置
const PADDLE_CLIENT_TOKEN = 'test_2a2ba3a00ebfd69613223c4a84a';
const PADDLE_PRICE_MONTHLY = 'pri_01khq7z06c3em7cd762fbk9pgf';
const PADDLE_PRICE_YEARLY = 'pri_01khq8064yknf0m9afmw3xfgfv';

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
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const { showToast } = useToast();
  const { user, signOut } = useAuth();
  const others = useOthers();
  const prevOthersRef = useRef<number[]>([]);

  // 移除 Liveblocks 水印
  useEffect(() => {
    const remove = () => {
      document.querySelectorAll('iframe').forEach((el) => {
        if (el.src?.includes('liveblocks') || el.title?.toLowerCase().includes('liveblocks')) {
          el.remove();
        }
      });
      document.querySelectorAll('[data-liveblocks-portal]').forEach(el => el.remove());
      // 按文本内容查找
      document.querySelectorAll('a[href*="liveblocks"], div').forEach(el => {
        if (el.textContent?.includes('Powered by') && el.textContent?.includes('liveblocks')) {
          (el as HTMLElement).style.display = 'none';
          el.parentElement && (el.parentElement.style.display = 'none');
        }
      });
    };
    remove();
    const observer = new MutationObserver(remove);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

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

  // AI 生成便签处理
  const handleAIGenerate = useCallback((notes: string[]) => {
    if (!editor) return;

    const COLORS = ['yellow', 'blue', 'green', 'violet', 'red'] as const;
    const center = editor.getViewportScreenCenter();
    const startX = center.x - 200;
    const startY = center.y - 100;

    notes.forEach((text, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      editor.createShape({
        id: createShapeId(),
        type: 'note',
        x: startX + col * 220,
        y: startY + row * 180,
        rotation: (Math.random() - 0.5) * 0.1,
        props: {
          color: COLORS[index % COLORS.length],
          text,
        },
      });
    });

    showToast(`已生成 ${notes.length} 个便签`, 'success');
    editor.setCurrentTool('select');
  }, [editor, showToast]);

  return (
    <div className="relative w-full h-screen bg-bg-light bg-dot-pattern overflow-hidden text-slate-900 selection:bg-blue-100 font-sans">
      
      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between pointer-events-none">
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto">
          <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl glass-panel text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm transition-all">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight drop-shadow-sm truncate max-w-[120px] sm:max-w-none">Q3 Brainstorming</h1>
            <ConnectionStatus />
          </div>
        </div>

        {/* Right Side: Avatars & Share */}
        <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto">
          <div className="glass-panel px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-full shadow-sm hidden xs:block">
            <LiveAvatarGroup />
          </div>
          
          <button 
            onClick={handleShare}
            style={{ background: '#6366f1', color: '#fff', padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
          >
            {copied ? <Check size={14} strokeWidth={2.5} /> : <Share size={14} strokeWidth={2.5} />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* User Avatar & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.id}`}
              alt="avatar"
              style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <button
              onClick={signOut}
              title="Logout"
              style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={16} color="#64748b" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Workspace */}
      <main className="absolute inset-0 z-0">
        <CanvasWrapper onEditorMount={setEditor} />
      </main>

      {/* Floating UI Elements */}
      <FollowMeToggle editor={editor} />
      <FloatingToolbar 
        activeTool={activeTool} 
        onToolSelect={handleToolSelect} 
        editor={editor} 
        onAIClick={() => setShowAIGenerator(true)}
      />

      {/* AI Generator Modal */}
      <AIGenerator
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onGenerate={handleAIGenerate}
      />
      
    </div>
  );
}

// 认证保护的应用内容
type PageType = 'landing' | 'pricing' | 'login' | 'app';

function AuthenticatedApp() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [page, setPage] = useState<PageType>('landing');
  const [paddleReady, setPaddleReady] = useState(false);

  // 初始化 Paddle
  useEffect(() => {
    if (window.Paddle) {
      window.Paddle.Environment.set('sandbox'); // 正式上线后改为 'production'
      window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
      setPaddleReady(true);
    }
  }, []);
  
  // 根据 URL path 初始化页面
  useEffect(() => {
    const path = window.location.pathname;
    const hasRoom = window.location.search.includes('room=');
    
    if (path === '/pricing') {
      setPage('pricing');
    } else if (path === '/login') {
      setPage('login');
    } else if (path === '/app' || hasRoom) {
      setPage('app');
    } else {
      setPage('landing');
    }
  }, []);

  // 导航函数
  const navigate = (newPage: PageType) => {
    setPage(newPage);
    if (newPage === 'landing') {
      window.history.pushState({}, '', '/');
    } else if (newPage === 'pricing') {
      window.history.pushState({}, '', '/pricing');
    } else if (newPage === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (newPage === 'app') {
      const roomId = nanoid(10);
      window.history.pushState({}, '', `/?room=${roomId}`);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('app');
    } else {
      navigate('login');
    }
  };

  const handleSelectPlan = (plan: 'free' | 'pro-monthly' | 'pro-yearly') => {
    // 未登录时跳转登录页
    if (!user?.email) {
      navigate('login');
      return;
    }
    
    const userEmail = user.email;
    
    if (plan === 'pro-monthly' && paddleReady) {
      window.Paddle.Checkout.open({
        items: [{ priceId: PADDLE_PRICE_MONTHLY, quantity: 1 }],
        customData: { email: userEmail },
        customer: { email: userEmail }
      });
    } else if (plan === 'pro-yearly' && paddleReady) {
      window.Paddle.Checkout.open({
        items: [{ priceId: PADDLE_PRICE_YEARLY, quantity: 1 }],
        customData: { email: userEmail },
        customer: { email: userEmail }
      });
    } else {
      handleGetStarted();
    }
  };
  
  // 获取房间 ID
  const roomId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || nanoid(10);
  }, [page]);
  
  // 生成稳定的用户信息
  const userInfo = useMemo(() => ({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || randomName(),
    color: randomColor(),
    avatar: user?.user_metadata?.avatar_url,
  }), [user]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f0f2f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid #e2e8f0', 
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Landing Page
  if (page === 'landing') {
    return (
      <LandingPage
        onGetStarted={handleGetStarted}
        onLogin={() => navigate('login')}
        onPricing={() => navigate('pricing')}
      />
    );
  }

  // Pricing Page
  if (page === 'pricing') {
    return (
      <PricingPage
        onBack={() => navigate('landing')}
        onSelectPlan={handleSelectPlan}
      />
    );
  }

  // Login Page
  if (page === 'login' && !user) {
    return <LoginPage onBack={() => navigate('landing')} />;
  }

  // App (requires login)
  if (!user) {
    return <LoginPage onBack={() => navigate('landing')} />;
  }

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

// 主应用入口
export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}