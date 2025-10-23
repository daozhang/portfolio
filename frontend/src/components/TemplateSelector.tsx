import React from 'react';
import styled from 'styled-components';
import { TemplateType } from '../types/blocks';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SelectorTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const TemplateOption = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${props => props.isSelected ? '#007bff' : '#e0e0e0'};
  border-radius: 8px;
  background: ${props => props.isSelected ? '#f0f8ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #007bff;
    background: #f0f8ff;
  }
`;

const TemplateIcon = styled.div`
  width: 40px;
  height: 30px;
  background: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #666;
`;

const TemplateName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  text-transform: capitalize;
`;

const TemplateDescription = styled.span`
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  line-height: 1.3;
`;

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templateInfo: Record<TemplateType, { icon: string; description: string }> = {
  gallery: {
    icon: '🖼️',
    description: 'Perfect for showcasing artwork and visual projects'
  },
  about: {
    icon: '👤',
    description: 'Ideal for personal stories and professional background'
  },
  contact: {
    icon: '📧',
    description: 'Clean layout for contact information and links'
  }
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange,
}) => {
  const templates: TemplateType[] = ['gallery', 'about', 'contact'];

  return (
    <SelectorContainer>
      <SelectorTitle>Choose Template</SelectorTitle>
      <TemplateGrid>
        {templates.map((template) => (
          <TemplateOption
            key={template}
            isSelected={selectedTemplate === template}
            onClick={() => onTemplateChange(template)}
          >
            <TemplateIcon>
              {templateInfo[template].icon}
            </TemplateIcon>
            <TemplateName>{template}</TemplateName>
            <TemplateDescription>
              {templateInfo[template].description}
            </TemplateDescription>
          </TemplateOption>
        ))}
      </TemplateGrid>
    </SelectorContainer>
  );
};