import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Tldraw, Editor, createShapeId, TLRecord, TLStoreSnapshot, createTLStore, defaultShapeUtils, throttle } from 'tldraw';
import { useRoom, useOthers, useUpdateMyPresence, useBroadcastEvent, useEventListener } from '../liveblocks.config';
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
  const room = useRoom();
  const updateMyPresence = useUpdateMyPresence();
  const broadcast = useBroadcastEvent();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 创建 Yjs 文档和 Provider
  const { yDoc, yProvider, yRecords } = useMemo(() => {
    const doc = new Y.Doc();
    const provider = new LiveblocksYjsProvider(room, doc);
    const records = doc.getMap<TLRecord>('tldraw-records');
    return { yDoc: doc, yProvider: provider, yRecords: records };
  }, [room]);

  // 监听 Yjs 变化，同步到 tldraw
  useEffect(() => {
    if (!editor || !yRecords) return;

    let isRemoteUpdate = false;

    // Yjs -> tldraw
    const handleYjsChange = () => {
      if (isRemoteUpdate) return;
      isRemoteUpdate = true;
      
      const allRecords: TLRecord[] = [];
      yRecords.forEach((value) => {
        allRecords.push(value);
      });
      
      // 获取当前 store 中的所有 records
      const currentRecords = editor.store.allRecords();
      const currentIds = new Set(currentRecords.map(r => r.id));
      const yIds = new Set(allRecords.map(r => r.id));
      
      // 添加或更新 records
      const toAdd: TLRecord[] = [];
      allRecords.forEach(record => {
        const existing = editor.store.get(record.id);
        if (!existing || JSON.stringify(existing) !== JSON.stringify(record)) {
          toAdd.push(record);
        }
      });
      
      // 删除不存在于 Yjs 中的 records
      const toRemove: TLRecord['id'][] = [];
      currentRecords.forEach(record => {
        // 不删除系统 records
        if (record.typeName === 'page' || record.typeName === 'document' || record.typeName === 'instance' || record.typeName === 'camera' || record.typeName === 'pointer') return;
        if (!yIds.has(record.id)) {
          toRemove.push(record.id);
        }
      });
      
      if (toAdd.length > 0 || toRemove.length > 0) {
        editor.store.mergeRemoteChanges(() => {
          if (toAdd.length > 0) {
            editor.store.put(toAdd);
          }
          if (toRemove.length > 0) {
            editor.store.remove(toRemove);
          }
        });
      }
      
      isRemoteUpdate = false;
    };

    yRecords.observe(handleYjsChange);
    
    // 初始同步
    handleYjsChange();

    return () => {
      yRecords.unobserve(handleYjsChange);
    };
  }, [editor, yRecords]);

  // 监听 tldraw 变化，同步到 Yjs
  useEffect(() => {
    if (!editor || !yRecords) return;

    const handleStoreChange = throttle(() => {
      const allRecords = editor.store.allRecords();
      
      yDoc.transact(() => {
        // 同步 shapes 和相关 records
        allRecords.forEach(record => {
          // 只同步 shape 类型的 records
          if (record.typeName === 'shape') {
            const existing = yRecords.get(record.id);
            if (!existing || JSON.stringify(existing) !== JSON.stringify(record)) {
              yRecords.set(record.id, record);
            }
          }
        });
        
        // 删除已不存在的 shapes
        const currentIds = new Set(allRecords.filter(r => r.typeName === 'shape').map(r => r.id));
        const keysToDelete: string[] = [];
        yRecords.forEach((_, key) => {
          if (!currentIds.has(key as any)) {
            keysToDelete.push(key);
          }
        });
        keysToDelete.forEach(key => yRecords.delete(key));
      });
    }, 50);

    const unsubscribe = editor.store.listen(handleStoreChange, { scope: 'document', source: 'user' });

    return () => {
      unsubscribe();
    };
  }, [editor, yRecords, yDoc]);

  // 清理
  useEffect(() => {
    return () => {
      yProvider.destroy();
      yDoc.destroy();
    };
  }, [yDoc, yProvider]);

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

    // 初始化示例数据（仅当画布为空时）
    setTimeout(() => {
      if (editorInstance.getCurrentPageShapes().length === 0 && yRecords.size === 0) {
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
      setIsReady(true);
    }, 500);

    setEditor(editorInstance);
    onEditorMount(editorInstance);
  }, [onEditorMount, yRecords]);

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