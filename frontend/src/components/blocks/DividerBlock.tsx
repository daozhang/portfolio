import React from 'react';
import styled from 'styled-components';
import { DividerData } from '../../types';

interface DividerBlockProps {
  data: DividerData;
  isEditing?: boolean;
  className?: string;
}

const DividerContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: 1.5rem 0;
  }
`;

const Divider = styled.hr<{ 
  dividerStyle: string; 
  thickness: number; 
  color?: string; 
}>`
  border: none;
  width: 100%;
  height: ${props => props.thickness}px;
  background-color: ${props => props.color || props.theme.colors.border};
  margin: 0;
  
  ${props => {
    switch (props.dividerStyle) {
      case 'dashed':
        return `
          background: none;
          border-top: ${props.thickness}px dashed ${props.color || props.theme.colors.border};
          height: 0;
        `;
      case 'dotted':
        return `
          background: none;
          border-top: ${props.thickness}px dotted ${props.color || props.theme.colors.border};
          height: 0;
        `;
      case 'solid':
      default:
        return `
          background-color: ${props.color || props.theme.colors.border};
        `;
    }
  }}
`;

const DecorativeDivider = styled.div<{ 
  dividerStyle: string; 
  thickness: number; 
  color?: string; 
}>`
  position: relative;
  width: 100%;
  height: ${props => props.thickness}px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: ${props => props.thickness}px;
    background-color: ${props => props.color || props.theme.colors.border};
    
    ${props => {
      switch (props.dividerStyle) {
        case 'dashed':
          return `
            background: none;
            border-top: ${props.thickness}px dashed ${props.color || props.theme.colors.border};
            height: 0;
          `;
        case 'dotted':
          return `
            background: none;
            border-top: ${props.thickness}px dotted ${props.color || props.theme.colors.border};
            height: 0;
          `;
        case 'solid':
        default:
          return `
            background-color: ${props.color || props.theme.colors.border};
          `;
      }
    }}
  }
`;

const GradientDivider = styled.div<{ thickness: number; color?: string }>`
  width: 100%;
  height: ${props => props.thickness}px;
  background: linear-gradient(
    to right,
    transparent 0%,
    ${props => props.color || props.theme.colors.border} 20%,
    ${props => props.color || props.theme.colors.border} 80%,
    transparent 100%
  );
`;

const WaveDivider = styled.div<{ thickness: number; color?: string }>`
  width: 100%;
  height: ${props => Math.max(props.thickness * 2, 20)}px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -50%;
    width: 200%;
    height: ${props => props.thickness}px;
    background: ${props => props.color || props.theme.colors.border};
    transform: translateY(-50%);
    border-radius: ${props => props.thickness}px;
    animation: wave 3s ease-in-out infinite;
  }
  
  @keyframes wave {
    0%, 100% {
      transform: translateY(-50%) translateX(0) scaleX(1);
    }
    50% {
      transform: translateY(-50%) translateX(-10px) scaleX(0.95);
    }
  }
`;

export const DividerBlock: React.FC<DividerBlockProps> = ({ 
  data, 
  isEditing = false, 
  className 
}) => {
  // For editing mode, we might want to show a more visible divider
  const displayColor = isEditing && !data.color ? '#cccccc' : data.color;
  const displayThickness = Math.max(data.thickness, 1);

  // Enhanced divider styles for better visual appeal
  const renderDivider = () => {
    switch (data.style) {
      case 'solid':
        if (displayThickness >= 3) {
          return (
            <GradientDivider 
              thickness={displayThickness} 
              color={displayColor}
            />
          );
        }
        return (
          <Divider
            dividerStyle={data.style}
            thickness={displayThickness}
            color={displayColor}
          />
        );
      
      case 'dashed':
      case 'dotted':
        return (
          <Divider
            dividerStyle={data.style}
            thickness={displayThickness}
            color={displayColor}
          />
        );
      
      default:
        return (
          <Divider
            dividerStyle="solid"
            thickness={displayThickness}
            color={displayColor}
          />
        );
    }
  };

  return (
    <DividerContainer className={className}>
      {renderDivider()}
    </DividerContainer>
  );
};