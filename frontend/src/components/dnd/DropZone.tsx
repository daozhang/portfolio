import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { DND_ITEM_TYPES, DragItem } from '../../types/dnd';

interface DropZoneProps {
  index: number;
  onDrop: (item: DragItem, dropIndex: number) => void;
  isVisible?: boolean;
}

const DropZoneContainer = styled.div<{ isOver: boolean; canDrop: boolean; isVisible: boolean }>`
  height: ${props => props.isVisible || (props.isOver && props.canDrop) ? '8px' : '2px'};
  background: ${props => {
    if (props.isOver && props.canDrop) return props.theme.colors.primary;
    if (props.isVisible) return `${props.theme.colors.primary}40`;
    return 'transparent';
  }};
  margin: ${props => props.isVisible || (props.isOver && props.canDrop) ? '0.5rem 0' : '0.25rem 0'};
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: transparent;
  }
`;

const DropIndicator = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
  white-space: nowrap;
  z-index: 10;
`;

export const DropZone: React.FC<DropZoneProps> = ({ 
  index, 
  onDrop, 
  isVisible = false 
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [DND_ITEM_TYPES.BLOCK_PALETTE, DND_ITEM_TYPES.BLOCK_INSTANCE],
    drop: (item: DragItem) => {
      onDrop(item, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const showIndicator = isOver && canDrop;

  return (
    <DropZoneContainer 
      ref={drop} 
      isOver={isOver} 
      canDrop={canDrop} 
      isVisible={isVisible}
    >
      <DropIndicator isVisible={showIndicator}>
        Drop here
      </DropIndicator>
    </DropZoneContainer>
  );
};