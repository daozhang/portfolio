import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DividerData } from '../../../types/blocks';

// Simple validation function to avoid circular dependencies
const validateDividerData = (data: DividerData) => {
  const errors: string[] = [];
  if (!['solid', 'dashed', 'dotted'].includes(data.style)) {
    errors.push('Divider style must be solid, dashed, or dotted');
  }
  return { isValid: errors.length === 0, errors };
};

interface DividerBlockEditorProps {
  data: DividerData;
  onChange: (data: DividerData) => void;
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
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
    box-shadow: 0 0 0 2px ${props => props.hasError ? props.theme.colors.danger : '#007bff20'};
  }
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RangeInput = styled.input<{ hasError?: boolean }>`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.colors.light};
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const RangeValue = styled.div`
  min-width: 40px;
  text-align: center;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.light};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.875rem;
`;

const ColorInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ColorInput = styled.input`
  width: 50px;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  background: none;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: ${props => props.theme.borderRadius.sm};
  }
`;

const ColorTextInput = styled.input<{ hasError?: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? props.theme.colors.danger : '#007bff20'};
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
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
`;

const PreviewDivider = styled.hr<{ 
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

const HelpText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
  line-height: 1.4;
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-1px);
  }
`;

export const DividerBlockEditor: React.FC<DividerBlockEditorProps> = ({
  data,
  onChange,
  onValidationChange
}) => {
  const [localData, setLocalData] = useState<DividerData>(data);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    const validation = validateDividerData(localData);
    setErrors(validation.errors);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [localData, onValidationChange]);

  const handleChange = (field: keyof DividerData, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const handleColorChange = (color: string) => {
    // Validate hex color format
    if (color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return; // Don't update if invalid format
    }
    handleChange('color', color || undefined);
  };

  const resetToDefault = () => {
    const defaultData: DividerData = {
      style: 'solid',
      thickness: 1,
      color: undefined
    };
    setLocalData(defaultData);
    onChange(defaultData);
  };

  const getFieldError = (field: keyof DividerData): string | undefined => {
    return errors.find(error => error.toLowerCase().includes(field.toLowerCase()));
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>Divider Block Editor</EditorTitle>
        <ResetButton onClick={resetToDefault}>
          Reset to Default
        </ResetButton>
      </EditorHeader>

      <FormRow>
        <FormGroup>
          <Label htmlFor="divider-style">Divider Style</Label>
          <Select
            id="divider-style"
            value={localData.style}
            onChange={(e) => handleChange('style', e.target.value as 'solid' | 'dashed' | 'dotted')}
            hasError={!!getFieldError('style')}
          >
            <option value="solid">Solid Line</option>
            <option value="dashed">Dashed Line</option>
            <option value="dotted">Dotted Line</option>
          </Select>
          {getFieldError('style') && (
            <ErrorMessage>{getFieldError('style')}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="divider-thickness">Thickness</Label>
          <RangeContainer>
            <RangeInput
              id="divider-thickness"
              type="range"
              min="1"
              max="10"
              value={localData.thickness}
              onChange={(e) => handleChange('thickness', parseInt(e.target.value))}
              hasError={!!getFieldError('thickness')}
            />
            <RangeValue>{localData.thickness}px</RangeValue>
          </RangeContainer>
          {getFieldError('thickness') && (
            <ErrorMessage>{getFieldError('thickness')}</ErrorMessage>
          )}
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label htmlFor="divider-color">Color (Optional)</Label>
        <ColorInputContainer>
          <ColorInput
            type="color"
            value={localData.color || '#dee2e6'}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <ColorTextInput
            id="divider-color"
            type="text"
            value={localData.color || ''}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#dee2e6 (default)"
            hasError={!!getFieldError('color')}
          />
        </ColorInputContainer>
        <HelpText>
          Enter a hex color code (e.g., #ff0000 for red) or leave empty for default color
        </HelpText>
        {getFieldError('color') && (
          <ErrorMessage>{getFieldError('color')}</ErrorMessage>
        )}
      </FormGroup>

      <PreviewContainer>
        <PreviewLabel>Preview</PreviewLabel>
        <PreviewDivider
          dividerStyle={localData.style}
          thickness={localData.thickness}
          color={localData.color}
        />
      </PreviewContainer>
    </EditorContainer>
  );
};