import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TitleData } from '../../../types/blocks';

// Simple validation function to avoid circular dependencies
const validateTitleData = (data: TitleData) => {
  const errors: string[] = [];
  if (!data.text || data.text.trim().length === 0) {
    errors.push('Title text is required');
  }
  return { isValid: errors.length === 0, errors };
};

interface TitleBlockEditorProps {
  data: TitleData;
  onChange: (data: TitleData) => void;
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
    box-shadow: 0 0 0 2px ${props => props.hasError ? '#dc354520' : '#007bff20'};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? '#dc354520' : '#007bff20'};
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
`;

const PreviewLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TitleBlockEditor: React.FC<TitleBlockEditorProps> = ({
  data,
  onChange,
  onValidationChange
}) => {
  const [localData, setLocalData] = useState<TitleData>(data);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    const validation = validateTitleData(localData);
    setErrors(validation.errors);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [localData, onValidationChange]);

  const handleChange = (field: keyof TitleData, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const getFieldError = (field: keyof TitleData): string | undefined => {
    return errors.find(error => error.toLowerCase().includes(field.toLowerCase()));
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>Title Block Editor</EditorTitle>
      </EditorHeader>

      <FormGroup>
        <Label htmlFor="title-text">Title Text</Label>
        <Input
          id="title-text"
          type="text"
          value={localData.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter title text..."
          hasError={!!getFieldError('text')}
        />
        {getFieldError('text') && (
          <ErrorMessage>{getFieldError('text')}</ErrorMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="title-level">Heading Level</Label>
        <Select
          id="title-level"
          value={localData.level}
          onChange={(e) => handleChange('level', parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
          hasError={!!getFieldError('level')}
        >
          <option value={1}>H1 - Largest</option>
          <option value={2}>H2 - Large</option>
          <option value={3}>H3 - Medium</option>
          <option value={4}>H4 - Small</option>
          <option value={5}>H5 - Smaller</option>
          <option value={6}>H6 - Smallest</option>
        </Select>
        {getFieldError('level') && (
          <ErrorMessage>{getFieldError('level')}</ErrorMessage>
        )}
      </FormGroup>

      <FormGroup>
        <Label>Text Alignment</Label>
        <RadioGroup>
          <RadioOption>
            <input
              type="radio"
              name="alignment"
              value="left"
              checked={localData.alignment === 'left'}
              onChange={(e) => handleChange('alignment', e.target.value as 'left' | 'center' | 'right')}
            />
            Left
          </RadioOption>
          <RadioOption>
            <input
              type="radio"
              name="alignment"
              value="center"
              checked={localData.alignment === 'center'}
              onChange={(e) => handleChange('alignment', e.target.value as 'left' | 'center' | 'right')}
            />
            Center
          </RadioOption>
          <RadioOption>
            <input
              type="radio"
              name="alignment"
              value="right"
              checked={localData.alignment === 'right'}
              onChange={(e) => handleChange('alignment', e.target.value as 'left' | 'center' | 'right')}
            />
            Right
          </RadioOption>
        </RadioGroup>
        {getFieldError('alignment') && (
          <ErrorMessage>{getFieldError('alignment')}</ErrorMessage>
        )}
      </FormGroup>

      <PreviewContainer>
        <PreviewLabel>Preview</PreviewLabel>
        <div style={{ textAlign: localData.alignment }}>
          {React.createElement(
            `h${localData.level}`,
            { 
              style: { 
                margin: 0,
                fontSize: localData.level === 1 ? '2rem' : 
                         localData.level === 2 ? '1.75rem' :
                         localData.level === 3 ? '1.5rem' :
                         localData.level === 4 ? '1.25rem' :
                         localData.level === 5 ? '1.125rem' : '1rem'
              } 
            },
            localData.text || 'Enter title text...'
          )}
        </div>
      </PreviewContainer>
    </EditorContainer>
  );
};