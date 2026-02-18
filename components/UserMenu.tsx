import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, Crown } from 'lucide-react';
import { User } from '../types';

interface UserMenuProps {
  user: User | null;
  isPro?: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function UserMenu({ user, isPro = false, onLogin, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={onLogin}
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Sign In
      </button>
    );
  }

  // 获取用户头像首字母
  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          border: isPro ? '2px solid #fef08a' : '2px solid transparent',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {initial}
        {isPro && (
          <span style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 14,
            height: 14,
            background: '#fef08a',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={8} color="#713f12" />
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: 220,
          background: '#1a1a24',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          padding: '8px 0',
          zIndex: 1000
        }}>
          {/* 用户信息 */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600
              }}>
                {initial}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>
                  {user.name || 'User'}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>
                  {user.email}
                </div>
              </div>
            </div>
            {isPro && (
              <div style={{
                marginTop: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, #fef08a, #fde047)',
                color: '#713f12',
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700
              }}>
                <Crown size={12} /> PRO Member
              </div>
            )}
          </div>

          {/* 退出登录 */}
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              fontSize: 14,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
