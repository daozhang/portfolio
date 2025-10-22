import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { BlockType } from '../../types/blocks';
import { DND_ITEM_TYPES, BlockPaletteDragItem, DragCollectedProps } from '../../types/dnd';

interface DraggableBlockPaletteProps {
  blockType: BlockType;
  label: string;
  children?: React.ReactNode;
}

const BlockItem = styled.div<{ isDragging: boolean }>`
  padding: 0.75rem;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s ease;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

export const DraggableBlockPalette: React.FC<DraggableBlockPaletteProps> = ({
  blockType,
  label,
  children
}) => {
  const [{ isDragging }, drag] = useDrag<
    BlockPaletteDragItem,
    unknown,
    DragCollectedProps
  >({
    type: DND_ITEM_TYPES.BLOCK_PALETTE,
    item: {
      type: DND_ITEM_TYPES.BLOCK_PALETTE,
      blockType,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  });

  return (
    <BlockItem ref={drag} isDragging={isDragging}>
      {children || label}
    </BlockItem>
  );
};