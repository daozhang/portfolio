import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RichTextData, validateRichTextData } from '../../../types';

interface RichTextBlockEditorProps {
  data: RichTextData;
  onChange: (data: RichTextData) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

const EditorContainer = styled.div`
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
  margin: 1rem 0;
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const EditorTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.sm} ${props => props.theme.borderRadius.sm} 0 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.light};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 200px;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.95rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary}20;
  }
`;

const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const ToolbarButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const PreviewContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};
  max-height: 300px;
  overflow-y: auto;
  
  /* Rich text content styling */
  p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1rem 0 0.5rem 0;
    font-weight: 600;
    line-height: 1.2;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  li {
    margin: 0.25rem 0;
    line-height: 1.6;
  }

  blockquote {
    margin: 1rem 0;
    padding: 1rem;
    border-left: 4px solid ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background};
    font-style: italic;
  }

  code {
    background-color: ${props => props.theme.colors.background};
    padding: 0.125rem 0.25rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875em;
  }

  pre {
    background-color: ${props => props.theme.colors.background};
    padding: 1rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    overflow-x: auto;
    margin: 1rem 0;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PreviewLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CharacterCount = styled.div<{ isOverLimit: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.isOverLimit ? props.theme.colors.danger : props.theme.colors.textSecondary};
  text-align: right;
  margin-top: 0.25rem;
`;

export const RichTextBlockEditor: React.FC<RichTextBlockEditorProps> = ({
  data,
  onChange,
  onValidationChange
}) => {
  const [localData, setLocalData] = useState<RichTextData>(data);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    const validation = validateRichTextData(localData);
    setErrors(validation.errors);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [localData, onValidationChange]);

  const handleChange = (content: string) => {
    const newData = { ...localData, content };
    setLocalData(newData);
    onChange(newData);
  };

  const insertHtmlTag = (tag: string, hasClosing: boolean = true) => {
    const textarea = document.getElementById('rich-text-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localData.content.substring(start, end);
    
    let newContent: string;
    if (hasClosing) {
      newContent = 
        localData.content.substring(0, start) +
        `<${tag}>${selectedText}</${tag}>` +
        localData.content.substring(end);
    } else {
      newContent = 
        localData.content.substring(0, start) +
        `<${tag}>` +
        localData.content.substring(start);
    }
    
    handleChange(newContent);
  };

  const insertList = (type: 'ul' | 'ol') => {
    const listHtml = `<${type}>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</${type}>`;
    const textarea = document.getElementById('rich-text-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = 
      localData.content.substring(0, start) +
      listHtml +
      localData.content.substring(start);
    
    handleChange(newContent);
  };

  const characterCount = localData.content.length;
  const isOverLimit = characterCount > 10000;

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>Rich Text Block Editor</EditorTitle>
      </EditorHeader>

      <TabContainer>
        <Tab active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
          Edit
        </Tab>
        <Tab active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
          Preview
        </Tab>
      </TabContainer>

      {activeTab === 'edit' ? (
        <FormGroup>
          <Label htmlFor="rich-text-content">HTML Content</Label>
          <ToolbarContainer>
            <ToolbarButton onClick={() => insertHtmlTag('p')}>Paragraph</ToolbarButton>
            <ToolbarButton onClick={() => insertHtmlTag('h2')}>Heading</ToolbarButton>
            <ToolbarButton onClick={() => insertHtmlTag('strong')}>Bold</ToolbarButton>
            <ToolbarButton onClick={() => insertHtmlTag('em')}>Italic</ToolbarButton>
            <ToolbarButton onClick={() => insertHtmlTag('a href=""')}>Link</ToolbarButton>
            <ToolbarButton onClick={() => insertList('ul')}>Bullet List</ToolbarButton>
            <ToolbarButton onClick={() => insertList('ol')}>Numbered List</ToolbarButton>
            <ToolbarButton onClick={() => insertHtmlTag('blockquote')}>Quote</ToolbarButton>
            <ToolbarButton onClick={() => insertHtmlTag('br', false)}>Line Break</ToolbarButton>
          </ToolbarContainer>
          <TextArea
            id="rich-text-content"
            value={localData.content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter HTML content..."
            hasError={errors.length > 0}
          />
          <CharacterCount isOverLimit={isOverLimit}>
            {characterCount} / 10,000 characters
          </CharacterCount>
          {errors.map((error, index) => (
            <ErrorMessage key={index}>{error}</ErrorMessage>
          ))}
        </FormGroup>
      ) : (
        <PreviewContainer>
          <PreviewLabel>Preview</PreviewLabel>
          <div dangerouslySetInnerHTML={{ __html: localData.content || '<p>No content to preview</p>' }} />
        </PreviewContainer>
      )}
    </EditorContainer>
  );
};