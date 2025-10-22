import React from 'react';
import styled from 'styled-components';
import { LinkData } from '../../types';

interface LinkBlockProps {
  data: LinkData;
  isEditing?: boolean;
  className?: string;
  onClick?: () => void;
}

const LinkContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonLink = styled.a<{ isEditing?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: ${props => props.isEditing ? 'default' : 'pointer'};
  border: 2px solid ${props => props.theme.colors.primary};
  min-width: 120px;
  text-align: center;
  
  &:hover {
    background-color: ${props => props.isEditing ? props.theme.colors.primary : props.theme.colors.primaryHover};
    border-color: ${props => props.isEditing ? props.theme.colors.primary : props.theme.colors.primaryHover};
    transform: ${props => props.isEditing ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.isEditing ? 'none' : props.theme.shadows.md};
  }
  
  &:active {
    transform: ${props => props.isEditing ? 'none' : 'translateY(0)'};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0.625rem 1.5rem;
    font-size: 0.95rem;
    min-width: 100px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem 1.25rem;
    font-size: 0.9rem;
    min-width: 90px;
  }
`;

const TextLink = styled.a<{ isEditing?: boolean }>`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.isEditing ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transition: width 0.2s ease;
  }
  
  &:hover {
    color: ${props => props.isEditing ? props.theme.colors.primary : props.theme.colors.primaryHover};
    
    &::after {
      width: ${props => props.isEditing ? '0' : '100%'};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 0.95rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const ExternalLinkIcon = styled.span`
  margin-left: 0.5rem;
  font-size: 0.875em;
  opacity: 0.8;
`;

const EditingOverlay = styled.div`
  position: relative;
  
  &::after {
    content: 'Link (editing mode)';
    position: absolute;
    top: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: ${props => props.theme.colors.dark};
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

export const LinkBlock: React.FC<LinkBlockProps> = ({ 
  data, 
  isEditing = false, 
  className,
  onClick 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      onClick?.();
      return;
    }
    
    // In non-editing mode, let the link work normally
    // The target and rel attributes will handle the new tab behavior
  };

  const linkProps = {
    href: isEditing ? '#' : data.url,
    target: !isEditing && data.openInNewTab ? '_blank' : undefined,
    rel: !isEditing && data.openInNewTab ? 'noopener noreferrer' : undefined,
    onClick: handleClick,
    isEditing
  };

  const linkContent = (
    <>
      {data.text}
      {!isEditing && data.openInNewTab && (
        <ExternalLinkIcon>↗</ExternalLinkIcon>
      )}
    </>
  );

  const LinkComponent = data.style === 'button' ? ButtonLink : TextLink;

  return (
    <LinkContainer className={className}>
      {isEditing ? (
        <EditingOverlay>
          <LinkComponent {...linkProps}>
            {linkContent}
          </LinkComponent>
        </EditingOverlay>
      ) : (
        <LinkComponent {...linkProps}>
          {linkContent}
        </LinkComponent>
      )}
    </LinkContainer>
  );
};