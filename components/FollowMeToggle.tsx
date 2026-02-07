import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';
import { Editor } from 'tldraw';
import { useBroadcastEvent, useEventListener, useSelf, useOthers } from '../liveblocks.config';

interface FollowMeToggleProps {
  editor: Editor | null;
}

export const FollowMeToggle: React.FC<FollowMeToggleProps> = ({ editor }) => {
  const [isActive, setIsActive] = useState(false);
  const [followingUserId, setFollowingUserId] = useState<string | null>(null);
  const broadcast = useBroadcastEvent();
  const self = useSelf();
  const others = useOthers();

  // 广播自己的视角位置
  useEffect(() => {
    if (!isActive || !editor) return;

    const interval = setInterval(() => {
      const camera = editor.getCamera();
      broadcast({
        type: 'FOLLOW_USER',
        userId: String(self?.connectionId || ''),
        camera: { x: camera.x, y: camera.y, z: camera.z },
      } as any);
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, editor, broadcast, self?.connectionId]);

  // 监听其他用户的跟随事件
  useEventListener(({ event, connectionId }) => {
    if (!editor || !followingUserId) return;
    
    const evt = event as any;
    if (evt.type === 'FOLLOW_USER' && evt.userId === followingUserId && evt.camera) {
      editor.setCamera(evt.camera, { animation: { duration: 100 } });
    }
  });

  const handleToggle = () => {
    if (isActive) {
      // 停止广播
      setIsActive(false);
    } else {
      // 开始广播
      setIsActive(true);
      setFollowingUserId(null);
    }
  };

  // 开始跟随某个用户
  const startFollowing = useCallback((userId: string) => {
    setFollowingUserId(userId);
    setIsActive(false);
  }, []);

  // 停止跟随
  const stopFollowing = useCallback(() => {
    setFollowingUserId(null);
  }, []);

  // 获取可跟随的用户列表
  const followableUsers = others.filter(o => o.presence?.name);

  return (
    <div className="absolute bottom-20 sm:bottom-8 left-3 sm:left-8 z-50">
      {/* 主按钮 */}
      <button 
        onClick={handleToggle}
        className={`flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-float glass-panel transition-all duration-300 ${
          isActive 
            ? 'bg-primary/90 text-white border-primary shadow-blue-500/25 ring-2 ring-blue-500/20' 
            : followingUserId
              ? 'bg-green-500/90 text-white shadow-green-500/25'
              : 'text-slate-700 hover:bg-white/80'
        }`}
      >
        <div className={`relative flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
          <User size={16} className="sm:w-5 sm:h-5" strokeWidth={2} />
        </div>
        <span className="font-semibold text-xs sm:text-sm tracking-wide">
          {isActive ? '广播中...' : followingUserId ? '跟随中' : 'Follow Me'}
        </span>
        
        {(isActive || followingUserId) && (
          <span className="ml-0.5 sm:ml-1 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        )}
      </button>

      {/* 跟随用户选择器（当有其他用户时显示） */}
      {!isActive && followableUsers.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 glass-panel rounded-xl shadow-float p-2 min-w-[120px] sm:min-w-[140px]">
          <div className="text-xs text-slate-500 px-2 py-1 mb-1">跟随用户</div>
          {followableUsers.map(user => (
            <button
              key={user.connectionId}
              onClick={() => followingUserId === String(user.connectionId) ? stopFollowing() : startFollowing(String(user.connectionId))}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                followingUserId === String(user.connectionId)
                  ? 'bg-green-100 text-green-700'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: user.info?.color || user.presence?.color || '#6366f1' }}
              />
              <span className="truncate max-w-[80px] sm:max-w-none">{user.info?.name || user.presence?.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};