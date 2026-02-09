import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Tldraw, Editor, createShapeId, TLRecord, throttle } from 'tldraw';
import { useRoom, useOthers, useUpdateMyPresence, useBroadcastEvent, useEventListener } from '../liveblocks.config';

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
  const updateMyPresence = useUpdateMyPresence();
  const broadcast = useBroadcastEvent();
  const [editor, setEditor] = useState<Editor | null>(null);
  const syncingRef = useRef(false);
  const initRef = useRef(false);

  // 监听远程广播事件
  useEventListener(({ event }) => {
    if (!editor || syncingRef.current) return;
    
    const e = event as any;
    if (e.type === 'SHAPE_UPDATE') {
      syncingRef.current = true;
      try {
        const { shapes, deletedIds } = e;
        
        if (shapes && shapes.length > 0) {
          editor.store.mergeRemoteChanges(() => {
            editor.store.put(shapes);
          });
        }
        
        if (deletedIds && deletedIds.length > 0) {
          editor.store.mergeRemoteChanges(() => {
            editor.store.remove(deletedIds);
          });
        }
      } catch (err) {
        console.warn('Remote sync error:', err);
      }
      syncingRef.current = false;
    }
  });

  // 监听本地变化并广播
  useEffect(() => {
    if (!editor) return;

    const handleStoreChange = throttle(() => {
      if (syncingRef.current) return;
      
      try {
        const allShapes = editor.store.allRecords().filter(r => r.typeName === 'shape');
        
        broadcast({
          type: 'SHAPE_UPDATE',
          shapes: allShapes,
          deletedIds: [],
        } as any);
      } catch (err) {
        console.warn('Broadcast error:', err);
      }
    }, 200);

    const unsubscribe = editor.store.listen(handleStoreChange, { scope: 'document', source: 'user' });

    return () => {
      unsubscribe();
    };
  }, [editor, broadcast]);

  const handleMount = useCallback((editorInstance: Editor) => {
    // 设置浅色主题
    editorInstance.user.updateUserPreferences({
      colorScheme: 'light',
    });

    // 配置相机
    editorInstance.setCameraOptions({
      isLocked: false,
      wheelBehavior: 'pan',
      zoomSteps: [0.5, 1, 2, 4],
    });
    
    editorInstance.setCamera({ x: 0, y: 0, z: 1 });

    // 初始化示例数据（仅当画布为空且未初始化时）
    if (!initRef.current) {
      initRef.current = true;
      
      setTimeout(() => {
        try {
          const shapes = editorInstance.getCurrentPageShapes();
          if (shapes.length === 0) {
            editorInstance.createShape({
              id: createShapeId('n1'),
              type: 'note',
              x: 150,
              y: 140,
              rotation: -0.05,
              props: {
                color: 'yellow',
                text: 'Define core user personas for the MVP launch 🚀',
              }
            });

            editorInstance.createShape({
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

            editorInstance.createShape({
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

            editorInstance.createShape({
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
        } catch (err) {
          console.warn('Init shapes error:', err);
        }
      }, 300);
    }

    setEditor(editorInstance);
    onEditorMount(editorInstance);

    // Mac 键盘快捷键支持（Delete/Backspace/Cmd+Backspace 删除选中）
    const handleKeyDown = (e: KeyboardEvent) => {
      const selected = editorInstance.getSelectedShapeIds();
      if (selected.length === 0) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // 避免在编辑文本时删除
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        
        e.preventDefault();
        editorInstance.deleteShapes(selected);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEditorMount]);

  // 光标追踪
  const handlePointerMove = (e: React.PointerEvent) => {
    updateMyPresence({
      cursor: { x: e.clientX, y: e.clientY },
    });
  };

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };

  return (
    <div 
      className="w-full h-full tldraw-wrapper relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Cursors />
      <Tldraw 
        onMount={handleMount}
        hideUi={true} 
      />
    </div>
  );
};