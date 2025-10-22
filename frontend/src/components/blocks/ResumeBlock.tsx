import React from 'react';
import styled from 'styled-components';
import { ResumeData } from '../../types/blocks';

interface ResumeBlockProps {
  data: ResumeData;
  isEditing?: boolean;
  className?: string;
}

const ResumeContainer = styled.div`
  margin: 2rem 0;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  padding-bottom: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Item = styled.div`
  position: relative;
  padding-left: 1.5rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 8px;
    height: 8px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 50%;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding-left: 1rem;
    
    &::before {
      width: 6px;
      height: 6px;
      top: 0.4rem;
    }
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const ItemTitleContainer = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const ItemSubtitle = styled.h5`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  line-height: 1.3;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.875rem;
  }
`;

const ItemDate = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  background-color: ${props => props.theme.colors.light};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    align-self: flex-start;
  }
`;

const ItemDescription = styled.p`
  margin: 0.75rem 0 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  background-color: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 2px dashed ${props => props.theme.colors.border};
`;

export const ResumeBlock: React.FC<ResumeBlockProps> = ({ 
  data, 
  isEditing = false, 
  className 
}) => {
  if (!data.sections || data.sections.length === 0) {
    return (
      <ResumeContainer className={className}>
        <EmptyState>
          {isEditing ? 'Click to add resume sections' : 'No resume information available'}
        </EmptyState>
      </ResumeContainer>
    );
  }

  return (
    <ResumeContainer className={className}>
      {data.sections.map((section, sectionIndex) => (
        <Section key={sectionIndex}>
          <SectionTitle>{section.title}</SectionTitle>
          
          {section.items && section.items.length > 0 ? (
            <ItemsContainer>
              {section.items.map((item, itemIndex) => (
                <Item key={itemIndex}>
                  <ItemHeader>
                    <ItemTitleContainer>
                      <ItemTitle>{item.title}</ItemTitle>
                      {item.subtitle && (
                        <ItemSubtitle>{item.subtitle}</ItemSubtitle>
                      )}
                    </ItemTitleContainer>
                    {item.date && (
                      <ItemDate>{item.date}</ItemDate>
                    )}
                  </ItemHeader>
                  
                  {item.description && (
                    <ItemDescription>{item.description}</ItemDescription>
                  )}
                </Item>
              ))}
            </ItemsContainer>
          ) : (
            <EmptyState>
              No items in this section
            </EmptyState>
          )}
        </Section>
      ))}
    </ResumeContainer>
  );
};