import React from 'react';
import styled from 'styled-components';
import { RichTextData } from '../../types';

interface RichTextBlockProps {
  data: RichTextData;
  isEditing?: boolean;
  className?: string;
}

const RichTextContainer = styled.div`
  margin: 1rem 0;
  
  /* Rich text content styling */
  p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1.5rem 0 0.5rem 0;
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    line-height: 1.2;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
    color: ${props => props.theme.colors.text};
  }

  li {
    margin: 0.25rem 0;
    line-height: 1.6;
  }

  blockquote {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.light};
    font-style: italic;
    color: ${props => props.theme.colors.textSecondary};
  }

  code {
    background-color: ${props => props.theme.colors.light};
    padding: 0.125rem 0.25rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875em;
    color: ${props => props.theme.colors.danger};
  }

  pre {
    background-color: ${props => props.theme.colors.light};
    padding: 1rem;
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    margin: 1rem 0;
    
    code {
      background: none;
      padding: 0;
      color: ${props => props.theme.colors.text};
    }
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  strong, b {
    font-weight: 600;
  }

  em, i {
    font-style: italic;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${props => props.theme.borderRadius.md};
    margin: 1rem 0;
  }

  hr {
    border: none;
    border-top: 1px solid ${props => props.theme.colors.border};
    margin: 2rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    font-weight: 600;
    background-color: ${props => props.theme.colors.light};
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    h4 { font-size: 1.125rem; }
    h5 { font-size: 1rem; }
    h6 { font-size: 0.875rem; }
    
    ul, ol {
      padding-left: 1.5rem;
    }
    
    blockquote {
      padding: 0.75rem 1rem;
    }
    
    pre {
      padding: 0.75rem;
    }
    
    th, td {
      padding: 0.5rem;
    }
  }
`;

export const RichTextBlock: React.FC<RichTextBlockProps> = ({ 
  data, 
  isEditing = false, 
  className 
}) => {
  return (
    <RichTextContainer 
      className={className}
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  );
};