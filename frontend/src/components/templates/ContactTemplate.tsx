import React from 'react';
import styled from 'styled-components';
import { Block } from '../../types/blocks';
import { BlockRenderer } from '../BlockRenderer';

const ContactContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
`;

const BlockWrapper = styled.div`
  width: 100%;
  
  /* Center align content for contact page */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface ContactTemplateProps {
  blocks: Block[];
  isEditing?: boolean;
}

export const ContactTemplate: React.FC<ContactTemplateProps> = ({ 
  blocks, 
  isEditing = false 
}) => {
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <ContactContainer>
      <ContactContent>
        {sortedBlocks.map((block) => (
          <BlockWrapper key={block.id}>
            <BlockRenderer block={block} isEditing={isEditing} />
          </BlockWrapper>
        ))}
      </ContactContent>
    </ContactContainer>
  );
};