import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { Block } from '../../types/blocks';
import { DND_ITEM_TYPES, BlockInstanceDragItem, DragCollectedProps } from '../../types/dnd';

interface DraggableBlockInstanceProps {
  block: Block;
  index: number;
  children: React.ReactNode;
  onEdit?: (block: Block) => void;
  onDelete?: (blockId: string) => void;
}

const BlockWrapper = styled.div<{ isDragging: boolean }>`
  position: relative;
  margin-bottom: 1rem;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  cursor: grab;
  
  &:hover .block-controls {
    opacity: 1;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const BlockControls = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
`;

const ControlButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: scale(1.1);
  }
  
  &.delete {
    background: #ef4444;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const BlockContent = styled.div`
  border: 2px solid transparent;
  border-radius: 4px;
  transition: border-color 0.2s ease;
  
  ${BlockWrapper}:hover & {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const DraggableBlockInstance: React.FC<DraggableBlockInstanceProps> = ({
  block,
  index,
  children,
  onEdit,
  onDelete
}) => {
  const [{ isDragging }, drag] = useDrag<
    BlockInstanceDragItem,
    unknown,
    DragCollectedProps
  >({
    type: DND_ITEM_TYPES.BLOCK_INSTANCE,
    item: {
      type: DND_ITEM_TYPES.BLOCK_INSTANCE,
      block,
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  });

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(block);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(block.id);
  };

  return (
    <BlockWrapper ref={drag} isDragging={isDragging}>
      <BlockControls className="block-controls">
        <ControlButton onClick={handleEdit} title="Edit block">
          ✏️
        </ControlButton>
        <ControlButton className="delete" onClick={handleDelete} title="Delete block">
          🗑️
        </ControlButton>
      </BlockControls>
      <BlockContent>
        {children}
      </BlockContent>
    </BlockWrapper>
  );
};