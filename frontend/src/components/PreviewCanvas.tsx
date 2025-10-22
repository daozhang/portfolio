import React from 'react';
import styled from 'styled-components';
import { Block } from '../types/blocks';
import { BlockRenderer } from './BlockRenderer';

interface PreviewCanvasProps {
  blocks: Block[];
  viewport: 'desktop' | 'mobile';
  template: 'gallery' | 'about' | 'contact';
  isPreviewMode: boolean;
}

const PreviewContainer = styled.div<{ viewport: 'desktop' | 'mobile'; isPreviewMode: boolean }>`
  width: 100%;
  max-width: ${props => props.viewport === 'mobile' ? '375px' : '100%'};
  margin: 0 auto;
  background: white;
  border-radius: ${props => props.viewport === 'mobile' ? '12px' : '0'};
  box-shadow: ${props => props.viewport === 'mobile' ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
  overflow: hidden;
  transition: all 0.3s ease;
  
  ${props => props.viewport === 'mobile' && `
    border: 1px solid ${props.theme.colors.border};
    min-height: 667px; /* iPhone SE height */
  `}
  
  ${props => props.isPreviewMode && `
    pointer-events: none;
  `}
`;

const PreviewContent = styled.div<{ viewport: 'desktop' | 'mobile' }>`
  padding: ${props => props.viewport === 'mobile' ? '1rem' : '2rem'};
  font-size: ${props => props.viewport === 'mobile' ? '0.9rem' : '1rem'};
  
  /* Mobile-specific styles */
  ${props => props.viewport === 'mobile' && `
    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.25rem; }
    h3 { font-size: 1.125rem; }
    h4 { font-size: 1rem; }
    h5 { font-size: 0.875rem; }
    h6 { font-size: 0.75rem; }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Adjust spacing for mobile */
    > * + * {
      margin-top: 1rem;
    }
  `}
`;

const TemplateWrapper = styled.div<{ template: 'gallery' | 'about' | 'contact' }>`
  /* Template-specific styles */
  ${props => props.template === 'gallery' && `
    .images-block {
      margin: 1.5rem 0;
    }
  `}
  
  ${props => props.template === 'about' && `
    .title-block:first-child {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .richtext-block {
      line-height: 1.6;
    }
  `}
  
  ${props => props.template === 'contact' && `
    .link-block {
      margin: 0.5rem 0;
    }
    
    .divider-block {
      margin: 2rem 0;
    }
  `}
`;

const EmptyPreview = styled.div<{ viewport: 'desktop' | 'mobile' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.viewport === 'mobile' ? '400px' : '600px'};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: 2rem;
`;

const EmptyPreviewContent = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    margin: 0;
  }
`;

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  blocks,
  viewport,
  template,
  isPreviewMode
}) => {
  const sortedBlocks = blocks.sort((a, b) => a.position - b.position);
  const isEmpty = sortedBlocks.length === 0;

  return (
    <PreviewContainer viewport={viewport} isPreviewMode={isPreviewMode}>
      <PreviewContent viewport={viewport}>
        <TemplateWrapper template={template}>
          {isEmpty ? (
            <EmptyPreview viewport={viewport}>
              <EmptyPreviewContent>
                <h3>Preview Mode</h3>
                <p>Add blocks to see your portfolio preview</p>
              </EmptyPreviewContent>
            </EmptyPreview>
          ) : (
            sortedBlocks.map((block) => (
              <div key={block.id} className={`${block.type}-block`}>
                <BlockRenderer block={block} isEditing={false} />
              </div>
            ))
          )}
        </TemplateWrapper>
      </PreviewContent>
    </PreviewContainer>
  );
};