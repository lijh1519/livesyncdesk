import { useSyncExternalStore, useCallback, useEffect, useState } from 'react';
import { useRoom } from '../liveblocks.config';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import * as Y from 'yjs';

// 创建 Yjs 文档和 Liveblocks Provider 的 hook
export function useYjsStore() {
  const room = useRoom();
  const [store, setStore] = useState<{
    yDoc: Y.Doc;
    yProvider: LiveblocksYjsProvider;
  } | null>(null);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setStore({ yDoc, yProvider });

    return () => {
      yProvider.destroy();
      yDoc.destroy();
    };
  }, [room]);

  return store;
}

// 连接状态 hook
export function useConnectionStatus() {
  const room = useRoom();
  
  const subscribe = useCallback(
    (callback: () => void) => room.subscribe('status', callback),
    [room]
  );
  
  const getSnapshot = useCallback(() => room.getStatus(), [room]);
  
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
