import React from 'react';
import styled from 'styled-components';
import { Block } from '../../types/blocks';
import { BlockRenderer } from '../BlockRenderer';

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    gap: 3rem;
  }
`;

const BlockWrapper = styled.div`
  width: 100%;
`;

interface GalleryTemplateProps {
  blocks: Block[];
  isEditing?: boolean;
}

export const GalleryTemplate: React.FC<GalleryTemplateProps> = ({ 
  blocks, 
  isEditing = false 
}) => {
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <GalleryContainer>
      <GalleryGrid>
        {sortedBlocks.map((block) => (
          <BlockWrapper key={block.id}>
            <BlockRenderer block={block} isEditing={isEditing} />
          </BlockWrapper>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
};