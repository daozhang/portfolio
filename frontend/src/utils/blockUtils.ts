import { Block, BlockType, BlockData } from '../types/blocks';

// Simple UUID generator
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Generate default data for each block type
export const getDefaultBlockData = (blockType: BlockType): BlockData => {
  switch (blockType) {
    case 'title':
      return {
        text: 'New Title',
        level: 2,
        alignment: 'left'
      };
    
    case 'richtext':
      return {
        content: '<p>Enter your text here...</p>'
      };
    
    case 'list':
      return {
        items: ['Item 1', 'Item 2', 'Item 3'],
        type: 'unordered'
      };
    
    case 'images':
      return {
        mediaFileIds: [],
        layout: 'grid',
        columns: 2
      };
    
    case 'resume':
      return {
        sections: [
          {
            title: 'Experience',
            items: [
              {
                title: 'Job Title',
                subtitle: 'Company Name',
                description: 'Job description...',
                date: '2023 - Present'
              }
            ]
          }
        ]
      };
    
    case 'carousel':
      return {
        mediaFileIds: [],
        autoPlay: false,
        showDots: true
      };
    
    case 'divider':
      return {
        style: 'solid',
        thickness: 1,
        color: '#e5e7eb'
      };
    
    case 'link':
      return {
        text: 'Click here',
        url: 'https://example.com',
        openInNewTab: true,
        style: 'button'
      };
    
    default:
      throw new Error(`Unknown block type: ${blockType}`);
  }
};

// Create a new block instance
export const createBlock = (blockType: BlockType, position: number): Block => {
  return {
    id: generateId(),
    type: blockType,
    position,
    data: getDefaultBlockData(blockType)
  } as Block;
};

// Reorder blocks by position
export const reorderBlocks = (blocks: Block[]): Block[] => {
  return blocks
    .sort((a, b) => a.position - b.position)
    .map((block, index) => ({
      ...block,
      position: index
    }));
};

// Insert block at specific position
export const insertBlockAtPosition = (
  blocks: Block[], 
  newBlock: Block, 
  position: number
): Block[] => {
  const updatedBlocks = blocks.map(block => 
    block.position >= position 
      ? { ...block, position: block.position + 1 }
      : block
  );
  
  return reorderBlocks([...updatedBlocks, { ...newBlock, position }]);
};

// Remove block by ID
export const removeBlock = (blocks: Block[], blockId: string): Block[] => {
  const filteredBlocks = blocks.filter(block => block.id !== blockId);
  return reorderBlocks(filteredBlocks);
};

// Move block to new position
export const moveBlock = (
  blocks: Block[], 
  blockId: string, 
  newPosition: number
): Block[] => {
  const blockToMove = blocks.find(block => block.id === blockId);
  if (!blockToMove) return blocks;
  
  const otherBlocks = blocks.filter(block => block.id !== blockId);
  return insertBlockAtPosition(otherBlocks, blockToMove, newPosition);
};