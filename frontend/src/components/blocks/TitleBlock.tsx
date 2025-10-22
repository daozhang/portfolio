import React from 'react';
import styled from 'styled-components';
import { TitleData } from '../../types';

interface TitleBlockProps {
  data: TitleData;
  isEditing?: boolean;
  className?: string;
}

const TitleContainer = styled.div<{ alignment: string }>`
  text-align: ${props => props.alignment};
  margin: 1rem 0;
`;

const Title = styled.h1<{ level: number }>`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  line-height: 1.2;
  
  ${props => {
    switch (props.level) {
      case 1:
        return 'font-size: 2.5rem;';
      case 2:
        return 'font-size: 2rem;';
      case 3:
        return 'font-size: 1.75rem;';
      case 4:
        return 'font-size: 1.5rem;';
      case 5:
        return 'font-size: 1.25rem;';
      case 6:
        return 'font-size: 1rem;';
      default:
        return 'font-size: 2rem;';
    }
  }}

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    ${props => {
      switch (props.level) {
        case 1:
          return 'font-size: 2rem;';
        case 2:
          return 'font-size: 1.75rem;';
        case 3:
          return 'font-size: 1.5rem;';
        case 4:
          return 'font-size: 1.25rem;';
        case 5:
          return 'font-size: 1.125rem;';
        case 6:
          return 'font-size: 1rem;';
        default:
          return 'font-size: 1.75rem;';
      }
    }}
  }
`;

export const TitleBlock: React.FC<TitleBlockProps> = ({ 
  data, 
  isEditing = false, 
  className 
}) => {
  const HeadingTag = `h${data.level}` as keyof JSX.IntrinsicElements;

  return (
    <TitleContainer alignment={data.alignment} className={className}>
      <Title as={HeadingTag} level={data.level}>
        {data.text}
      </Title>
    </TitleContainer>
  );
};