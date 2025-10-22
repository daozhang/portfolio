import React from 'react';
import styled from 'styled-components';

interface ViewportSwitcherProps {
  currentViewport: 'desktop' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'mobile') => void;
  disabled?: boolean;
}

const SwitcherContainer = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  background: white;
`;

const ViewportButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.isActive ? props.theme.colors.primary : 'white'};
  color: ${props => props.isActive ? 'white' : props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.isActive ? props.theme.colors.primaryHover : props.theme.colors.background};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:last-child) {
    border-right: 1px solid ${props => props.theme.colors.border};
  }
`;

const Icon = styled.span`
  font-size: 1rem;
`;

export const ViewportSwitcher: React.FC<ViewportSwitcherProps> = ({
  currentViewport,
  onViewportChange,
  disabled = false
}) => {
  return (
    <SwitcherContainer>
      <ViewportButton
        isActive={currentViewport === 'desktop'}
        onClick={() => onViewportChange('desktop')}
        disabled={disabled}
        title="Desktop view"
      >
        <Icon>🖥️</Icon>
        Desktop
      </ViewportButton>
      <ViewportButton
        isActive={currentViewport === 'mobile'}
        onClick={() => onViewportChange('mobile')}
        disabled={disabled}
        title="Mobile view"
      >
        <Icon>📱</Icon>
        Mobile
      </ViewportButton>
    </SwitcherContainer>
  );
};