// Drag and drop types and constants for the portfolio builder

import { Block, BlockType } from './blocks';

// DND item types
export const DND_ITEM_TYPES = {
  BLOCK_PALETTE: 'block_palette',
  BLOCK_INSTANCE: 'block_instance',
} as const;

// Drag item interfaces
export interface BlockPaletteDragItem {
  type: typeof DND_ITEM_TYPES.BLOCK_PALETTE;
  blockType: BlockType;
}

export interface BlockInstanceDragItem {
  type: typeof DND_ITEM_TYPES.BLOCK_INSTANCE;
  block: Block;
  index: number;
}

export type DragItem = BlockPaletteDragItem | BlockInstanceDragItem;

// Drop result interface
export interface DropResult {
  dropIndex: number;
  dropZone: 'canvas' | 'trash';
}

// DND monitor interfaces
export interface DragCollectedProps {
  isDragging: boolean;
  canDrag: boolean;
}

export interface DropCollectedProps {
  isOver: boolean;
  canDrop: boolean;
  dragItem: DragItem | null;
}