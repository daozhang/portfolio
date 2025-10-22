import React from 'react';
import { Block } from '../types/blocks';
import {
  TitleBlock,
  RichTextBlock,
  ListBlock,
  ImagesBlock,
  ResumeBlock,
  CarouselBlock,
  DividerBlock,
  LinkBlock
} from './blocks';

interface BlockRendererProps {
  block: Block;
  isEditing?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  isEditing = false 
}) => {
  const commonProps = {
    key: block.id,
    data: block.data,
    isEditing,
  };

  switch (block.type) {
    case 'title':
      return <TitleBlock {...commonProps} data={block.data} />;
    
    case 'richtext':
      return <RichTextBlock {...commonProps} data={block.data} />;
    
    case 'list':
      return <ListBlock {...commonProps} data={block.data} />;
    
    case 'images':
      return <ImagesBlock {...commonProps} data={block.data} />;
    
    case 'resume':
      return <ResumeBlock {...commonProps} data={block.data} />;
    
    case 'carousel':
      return <CarouselBlock {...commonProps} data={block.data} />;
    
    case 'divider':
      return <DividerBlock {...commonProps} data={block.data} />;
    
    case 'link':
      return <LinkBlock {...commonProps} data={block.data} />;
    
    default:
      return (
        <div style={{ padding: '1rem', border: '1px dashed #ccc', color: '#666' }}>
          Unknown block type: {(block as any).type}
        </div>
      );
  }
};