export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string;
  color: string;
}

export interface StickyNoteData {
  id: string;
  content: string;
  author: User;
  color: 'yellow' | 'blue' | 'green' | 'pink';
  position: { x: number; y: number };
  rotation: number;
}

export type ToolType = 'select' | 'hand' | 'draw' | 'shape' | 'note' | 'image';