import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { DND_ITEM_TYPES, DragItem, DropCollectedProps } from '../../types/dnd';

interface DroppableCanvasProps {
  children: React.ReactNode;
  onDrop: (item: DragItem, dropIndex: number) => void;
  isEmpty?: boolean;
}

const CanvasContainer = styled.div<{ isOver: boolean; canDrop: boolean; isEmpty: boolean }>`
  flex: 1;
  min-height: ${props => props.isEmpty ? '600px' : 'auto'};
  padding: 2rem;
  border: 2px dashed ${props => {
    if (props.isOver && props.canDrop) return props.theme.colors.primary;
    if (props.isEmpty) return props.theme.colors.border;
    return 'transparent';
  }};
  border-radius: 8px;
  background: ${props => props.isOver && props.canDrop ? `${props.theme.colors.primary}10` : 'transparent'};
  transition: all 0.2s ease;
  
  ${props => props.isEmpty && `
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props.theme.colors.textSecondary};
  `}
`;

const DropZone = styled.div<{ isVisible: boolean; position: number }>`
  height: ${props => props.isVisible ? '4px' : '0'};
  background: ${props => props.theme.colors.primary};
  margin: ${props => props.isVisible ? '0.5rem 0' : '0'};
  border-radius: 2px;
  transition: all 0.2s ease;
  opacity: ${props => props.isVisible ? 1 : 0};
`;

export const DroppableCanvas: React.FC<DroppableCanvasProps> = ({
  children,
  onDrop,
  isEmpty = false
}) => {
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    unknown,
    DropCollectedProps
  >({
    accept: [DND_ITEM_TYPES.BLOCK_PALETTE, DND_ITEM_TYPES.BLOCK_INSTANCE],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Calculate drop index based on mouse position
        const dropIndex = calculateDropIndex(monitor.getClientOffset());
        onDrop(item, dropIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      dragItem: monitor.getItem(),
    }),
  });

  const calculateDropIndex = (_clientOffset: any): number => {
    // For now, return 0 (append to end). This will be enhanced in subtask 7.2
    return 0;
  };

  return (
    <CanvasContainer 
      ref={drop} 
      isOver={isOver} 
      canDrop={canDrop} 
      isEmpty={isEmpty}
    >
      {isEmpty ? (
        <div>
          {isOver && canDrop 
            ? 'Drop blocks here to start building' 
            : 'Drag blocks here to start building your portfolio'
          }
        </div>
      ) : (
        <>
          {isOver && canDrop && (
            <DropZone isVisible={true} position={0} />
          )}
          {children}
        </>
      )}
    </CanvasContainer>
  );
};