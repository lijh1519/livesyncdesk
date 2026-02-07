import React, { useCallback, useEffect, useState } from 'react';
import { Tldraw, Editor, createShapeId, TLStoreWithStatus, createTLStore, defaultShapeUtils } from 'tldraw';
import { useRoom, useOthers, useUpdateMyPresence, useSelf } from '../liveblocks.config';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import * as Y from 'yjs';

interface CanvasWrapperProps {
  onEditorMount: (editor: Editor) => void;
}

// 用户光标组件
function Cursors() {
  const others = useOthers();
  
  return (
    <>
      {others.map(({ connectionId, presence, info }) => {
        if (!presence?.cursor) return null;
        return (
          <div
            key={connectionId}
            className="pointer-events-none absolute z-50 transition-transform duration-75"
            style={{
              transform: `translate(${presence.cursor.x}px, ${presence.cursor.y}px)`,
            }}
          >
            {/* 光标 SVG */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            >
              <path
                d="M5.65376 12.4563L12.5 19.0014L12.5 4.99873L5.65376 12.4563Z"
                fill={info?.color || presence.color || '#6366f1'}
              />
            </svg>
            {/* 用户名标签 */}
            <div
              className="ml-4 -mt-1 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap shadow-sm"
              style={{ backgroundColor: info?.color || presence.color || '#6366f1' }}
            >
              {info?.name || presence.name || 'Anonymous'}
            </div>
          </div>
        );
      })}
    </>
  );
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ onEditorMount }) => {
  const room = useRoom();
  const updateMyPresence = useUpdateMyPresence();
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({ status: 'loading' });

  // 初始化 Yjs 同步
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    
    // 创建 tldraw store
    const store = createTLStore({ shapeUtils: defaultShapeUtils });
    
    // 设置状态为同步中
    setStoreWithStatus({
      status: 'synced-remote',
      store,
      connectionStatus: 'online',
    });

    return () => {
      yProvider.destroy();
      yDoc.destroy();
    };
  }, [room]);

  const handleMount = useCallback((editor: Editor) => {
    // 1. Force Light Mode to prevent "Black Version"
    editor.user.updateUserPreferences({
      colorScheme: 'light',
    });

    // 2. Configure Camera
    editor.setCameraOptions({
      isLocked: false,
      wheelBehavior: 'pan',
      zoomSteps: [0.5, 1, 2, 4],
    });
    
    // Set initial camera
    editor.setCamera({ x: 0, y: 0, z: 1 });

    // 3. Initialize Mock Data (only if empty)
    if (editor.getCurrentPageShapes().length === 0) {
        
        // Note 1
        editor.createShape({
            id: createShapeId('n1'),
            type: 'note',
            x: 150,
            y: 140,
            rotation: -0.05, // radians
            props: {
                color: 'yellow',
                text: 'Define core user personas for the MVP launch 🚀',
            }
        });

        // Note 2
        editor.createShape({
            id: createShapeId('n2'),
            type: 'note',
            x: 520,
            y: 200,
            rotation: 0.08,
            props: {
                color: 'blue',
                text: 'Integration with existing API endpoints?',
            }
        });

        // Image Placeholder
        editor.createShape({
            id: createShapeId('img1'),
            type: 'geo',
            x: 280,
            y: 320,
            rotation: 0.02,
            props: {
                w: 400,
                h: 300,
                geo: 'rectangle',
                color: 'grey',
                text: 'Mobile Navigation V2\n(Reference Image)',
                fill: 'pattern',
            }
        });

        // Dashed Arrow
        editor.createShape({
            id: createShapeId('arrow1'),
            type: 'arrow',
            x: 350,
            y: 180,
            props: {
                start: { x: 0, y: 0 },
                end: { x: 200, y: 50 },
                dash: 'dashed',
                color: 'grey',
            }
        });
    }

    // 追踪光标位置
    const handlePointerMove = (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      updateMyPresence({
        cursor: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      });
    };

    const handlePointerLeave = () => {
      updateMyPresence({ cursor: null });
    };

    onEditorMount(editor);
  }, [onEditorMount, updateMyPresence]);

  // 光标追踪的包装器
  const handlePointerMove = (e: React.PointerEvent) => {
    updateMyPresence({
      cursor: { x: e.clientX, y: e.clientY },
    });
  };

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };

  if (storeWithStatus.status === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
          <span>连接协作服务器...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full tldraw-wrapper relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Cursors />
      <Tldraw 
        store={storeWithStatus}
        onMount={handleMount}
        hideUi={true} 
      />
    </div>
  );
};