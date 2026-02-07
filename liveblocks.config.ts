import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// 创建 Liveblocks 客户端
const apiKey = import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY;
console.log('[Liveblocks] API Key loaded:', apiKey ? 'Yes' : 'No');

const client = createClient({
  publicApiKey: apiKey || "pk_dev_placeholder",
});

// 定义 Presence 类型（用户实时状态）
type Presence = {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string;
};

// 定义 Storage 类型（持久化数据）
type Storage = {
  // tldraw 使用 Yjs 管理自己的存储，这里留空
};

// 定义用户元数据
type UserMeta = {
  id: string;
  info: {
    name: string;
    color: string;
    avatar?: string;
  };
};

// 定义房间事件
type RoomEvent = {
  type: "FOLLOW_USER";
  userId: string;
};

// 导出类型化的 hooks
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useOthersMapped,
  useSelf,
  useStorage,
  useMutation,
  useBroadcastEvent,
  useEventListener,
  useStatus,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
