import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ListData } from '../../../types/blocks';

// Simple validation function to avoid circular dependencies
const validateListData = (data: ListData) => {
  const errors: string[] = [];
  if (!data.items || data.items.length === 0) {
    errors.push('List must have at least one item');
  }
  return { isValid: errors.length === 0, errors };
};

interface ListBlockEditorProps {
  data: ListData;
  onChange: (data: ListData) => void;
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
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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

const ItemsContainer = styled.div`
  margin-bottom: 1rem;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ItemInput = styled.input<{ hasError?: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError ? props.theme.colors.danger : '#007bff20'};
  }
`;

const ItemNumber = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.light};
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

const RemoveButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.danger};
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.success};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
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

const PreviewList = styled.ul<{ listType: string }>`
  margin: 0;
  padding-left: 2rem;
  list-style-type: ${props => props.listType === 'ordered' ? 'decimal' : 'disc'};
`;

const PreviewOrderedList = styled.ol`
  margin: 0;
  padding-left: 2rem;
`;

const PreviewListItem = styled.li`
  margin: 0.25rem 0;
  line-height: 1.4;
`;

const ItemCount = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;
  margin-top: 0.5rem;
`;

export const ListBlockEditor: React.FC<ListBlockEditorProps> = ({
  data,
  onChange,
  onValidationChange
}) => {
  const [localData, setLocalData] = useState<ListData>(data);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  useEffect(() => {
    const validation = validateListData(localData);
    setErrors(validation.errors);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [localData, onValidationChange]);

  const handleTypeChange = (type: 'ordered' | 'unordered') => {
    const newData = { ...localData, type };
    setLocalData(newData);
    onChange(newData);
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...localData.items];
    newItems[index] = value;
    const newData = { ...localData, items: newItems };
    setLocalData(newData);
    onChange(newData);
  };

  const addItem = () => {
    if (localData.items.length >= 50) return;
    
    const newItems = [...localData.items, ''];
    const newData = { ...localData, items: newItems };
    setLocalData(newData);
    onChange(newData);
  };

  const removeItem = (index: number) => {
    if (localData.items.length <= 1) return;
    
    const newItems = localData.items.filter((_, i) => i !== index);
    const newData = { ...localData, items: newItems };
    setLocalData(newData);
    onChange(newData);
  };

  const getItemError = (index: number): boolean => {
    return errors.some(error => error.includes(`item ${index + 1}`));
  };

  const generalErrors = errors.filter(error => 
    !error.includes('item ') || error.includes('at least one item') || error.includes('more than 50 items')
  );

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>List Block Editor</EditorTitle>
      </EditorHeader>

      <FormGroup>
        <Label>List Type</Label>
        <RadioGroup>
          <RadioOption>
            <input
              type="radio"
              name="listType"
              value="unordered"
              checked={localData.type === 'unordered'}
              onChange={() => handleTypeChange('unordered')}
            />
            Bullet List (•)
          </RadioOption>
          <RadioOption>
            <input
              type="radio"
              name="listType"
              value="ordered"
              checked={localData.type === 'ordered'}
              onChange={() => handleTypeChange('ordered')}
            />
            Numbered List (1, 2, 3...)
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      <FormGroup>
        <Label>List Items</Label>
        <ItemsContainer>
          {localData.items.map((item, index) => (
            <ItemRow key={index}>
              <ItemNumber>
                {localData.type === 'ordered' ? index + 1 : '•'}
              </ItemNumber>
              <ItemInput
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`List item ${index + 1}...`}
                hasError={getItemError(index)}
              />
              <RemoveButton
                onClick={() => removeItem(index)}
                disabled={localData.items.length <= 1}
                title="Remove item"
              >
                ×
              </RemoveButton>
            </ItemRow>
          ))}
        </ItemsContainer>
        
        <AddButton
          onClick={addItem}
          disabled={localData.items.length >= 50}
        >
          + Add Item
        </AddButton>
        
        <ItemCount>
          {localData.items.length} / 50 items
        </ItemCount>
        
        {generalErrors.map((error, index) => (
          <ErrorMessage key={index}>{error}</ErrorMessage>
        ))}
      </FormGroup>

      <PreviewContainer>
        <PreviewLabel>Preview</PreviewLabel>
        {localData.items.length > 0 && localData.items.some(item => item.trim()) ? (
          localData.type === 'ordered' ? (
            <PreviewOrderedList>
              {localData.items.filter(item => item.trim()).map((item, index) => (
                <PreviewListItem key={index}>{item}</PreviewListItem>
              ))}
            </PreviewOrderedList>
          ) : (
            <PreviewList listType={localData.type}>
              {localData.items.filter(item => item.trim()).map((item, index) => (
                <PreviewListItem key={index}>{item}</PreviewListItem>
              ))}
            </PreviewList>
          )
        ) : (
          <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
            Add list items to see preview
          </div>
        )}
      </PreviewContainer>
    </EditorContainer>
  );
};