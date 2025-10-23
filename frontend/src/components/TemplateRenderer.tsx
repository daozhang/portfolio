import React from 'react';
import { TemplateType, Block } from '../types/blocks';
import { GalleryTemplate, AboutTemplate, ContactTemplate } from './templates';

interface TemplateRendererProps {
  template: TemplateType;
  blocks: Block[];
  isEditing?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  blocks,
  isEditing = false,
}) => {
  switch (template) {
    case 'gallery':
      return <GalleryTemplate blocks={blocks} isEditing={isEditing} />;
    
    case 'about':
      return <AboutTemplate blocks={blocks} isEditing={isEditing} />;
    
    case 'contact':
      return <ContactTemplate blocks={blocks} isEditing={isEditing} />;
    
    default:
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Unknown template: {template}
        </div>
      );
  }
};