import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LinkData, validateLinkData } from '../../../types';

interface LinkBlockEditorProps {
  data: LinkData;
  onChange: (data: LinkData) => void;
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

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary}20;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  input[type="radio"] {
    margin: 0;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  input[type="checkbox"] {
    margin: 0;
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
  display: flex;
  justify-content: center;
`;

const PreviewLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
`;

const PreviewButtonLink = styled.div`
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
  border: 2px solid ${props => props.theme.colors.primary};
  min-width: 120px;
  text-align: center;
  cursor: default;
`;

const PreviewTextLink = styled.div`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: default;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
  }
`;

const UrlPreview = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
  word-break: break-all;
  background-color: ${props => props.theme.colors.background};
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
  line-height: 1.4;
`;

export const LinkBlockEditor: React.FC<LinkBlockEditorProps> = ({
  data,
  onChange,
  onValidationChange
}) => {
  const [localData, setLocalData] = useState<LinkData>(data);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    const validation = validateLinkData(localData);
    setErrors(validation.errors);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [localData, onValidationChange]);

  const handleChange = (field: keyof LinkData, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const getFieldError = (field: keyof LinkData): string | undefined => {
    return errors.find(error => error.toLowerCase().includes(field.toLowerCase()));
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>Link Block Editor</EditorTitle>
      </EditorHeader>

      <FormGroup>
        <Label htmlFor="link-text">Link Text</Label>
        <Input
          id="link-text"
          type="text"
          value={localData.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter link text..."
          hasError={!!getFieldError('text')}
        />
        {getFieldError('text') && (
          <ErrorMessage>{getFieldError('text')}</ErrorMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="link-url">URL</Label>
        <Input
          id="link-url"
          type="url"
          value={localData.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://example.com"
          hasError={!!getFieldError('url')}
        />
        <HelpText>
          Enter a complete URL starting with http:// or https://
        </HelpText>
        {getFieldError('url') && (
          <ErrorMessage>{getFieldError('url')}</ErrorMessage>
        )}
        {localData.url && !getFieldError('url') && (
          <UrlPreview>
            Preview: {localData.url}
          </UrlPreview>
        )}
      </FormGroup>

      <FormGroup>
        <Label>Link Style</Label>
        <RadioGroup>
          <RadioOption>
            <input
              type="radio"
              name="linkStyle"
              value="button"
              checked={localData.style === 'button'}
              onChange={(e) => handleChange('style', e.target.value as 'button' | 'text')}
            />
            Button Style
          </RadioOption>
          <RadioOption>
            <input
              type="radio"
              name="linkStyle"
              value="text"
              checked={localData.style === 'text'}
              onChange={(e) => handleChange('style', e.target.value as 'button' | 'text')}
            />
            Text Link
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      <FormGroup>
        <Label>Link Behavior</Label>
        <CheckboxGroup>
          <CheckboxOption>
            <input
              type="checkbox"
              checked={localData.openInNewTab}
              onChange={(e) => handleChange('openInNewTab', e.target.checked)}
            />
            Open in new tab
          </CheckboxOption>
        </CheckboxGroup>
        <HelpText>
          When checked, the link will open in a new browser tab/window
        </HelpText>
      </FormGroup>

      <PreviewContainer>
        <div>
          <PreviewLabel>Preview</PreviewLabel>
          {localData.style === 'button' ? (
            <PreviewButtonLink>
              {localData.text || 'Enter link text...'}
              {localData.openInNewTab && ' ↗'}
            </PreviewButtonLink>
          ) : (
            <PreviewTextLink>
              {localData.text || 'Enter link text...'}
              {localData.openInNewTab && ' ↗'}
            </PreviewTextLink>
          )}
        </div>
      </PreviewContainer>
    </EditorContainer>
  );
};