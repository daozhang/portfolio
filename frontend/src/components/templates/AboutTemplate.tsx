import React from 'react';
import styled from 'styled-components';
import { Block } from '../../types/blocks';
import { BlockRenderer } from '../BlockRenderer';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BlockWrapper = styled.div`
  width: 100%;
  
  /* Special styling for about page blocks */
  &:first-child {
    text-align: center;
    margin-bottom: 1rem;
  }
`;

interface AboutTemplateProps {
  blocks: Block[];
  isEditing?: boolean;
}

export const AboutTemplate: React.FC<AboutTemplateProps> = ({ 
  blocks, 
  isEditing = false 
}) => {
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <AboutContainer>
      <AboutContent>
        {sortedBlocks.map((block) => (
          <BlockWrapper key={block.id}>
            <BlockRenderer block={block} isEditing={isEditing} />
          </BlockWrapper>
        ))}
      </AboutContent>
    </AboutContainer>
  );
};