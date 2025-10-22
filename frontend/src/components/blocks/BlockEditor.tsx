import React from 'react';
import {
  Block,
  validateBlock,
  TitleData,
  RichTextData,
  ListData,
  LinkData,
  DividerData
} from '../../types';
import {
  TitleBlockEditor,
  RichTextBlockEditor,
  ListBlockEditor,
  LinkBlockEditor,
  DividerBlockEditor
} from './editors';

interface BlockEditorProps {
  block: Block;
  onChange: (block: Block) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onChange,
  onValidationChange
}) => {
  const handleEditorValidationChange = (isValid: boolean, errors: string[]) => {
    onValidationChange?.(isValid, errors);
  };

  switch (block.type) {
    case 'title': {
      const handleTitleChange = (data: TitleData) => {
        const updatedBlock = { ...block, data };
        onChange(updatedBlock);

        // Validate the entire block
        if (onValidationChange) {
          const validation = validateBlock(updatedBlock);
          onValidationChange(validation.isValid, validation.errors);
        }
      };

      return (
        <TitleBlockEditor
          data={block.data as TitleData}
          onChange={handleTitleChange}
          onValidationChange={handleEditorValidationChange}
        />
      );
    }

    case 'richtext': {
      const handleRichTextChange = (data: RichTextData) => {
        const updatedBlock = { ...block, data };
        onChange(updatedBlock);

        // Validate the entire block
        if (onValidationChange) {
          const validation = validateBlock(updatedBlock);
          onValidationChange(validation.isValid, validation.errors);
        }
      };

      return (
        <RichTextBlockEditor
          data={block.data as RichTextData}
          onChange={handleRichTextChange}
          onValidationChange={handleEditorValidationChange}
        />
      );
    }

    case 'list': {
      const handleListChange = (data: ListData) => {
        const updatedBlock = { ...block, data };
        onChange(updatedBlock);

        // Validate the entire block
        if (onValidationChange) {
          const validation = validateBlock(updatedBlock);
          onValidationChange(validation.isValid, validation.errors);
        }
      };

      return (
        <ListBlockEditor
          data={block.data as ListData}
          onChange={handleListChange}
          onValidationChange={handleEditorValidationChange}
        />
      );
    }

    case 'link': {
      const handleLinkChange = (data: LinkData) => {
        const updatedBlock = { ...block, data };
        onChange(updatedBlock);

        // Validate the entire block
        if (onValidationChange) {
          const validation = validateBlock(updatedBlock);
          onValidationChange(validation.isValid, validation.errors);
        }
      };

      return (
        <LinkBlockEditor
          data={block.data as LinkData}
          onChange={handleLinkChange}
          onValidationChange={handleEditorValidationChange}
        />
      );
    }

    case 'divider': {
      const handleDividerChange = (data: DividerData) => {
        const updatedBlock = { ...block, data };
        onChange(updatedBlock);

        // Validate the entire block
        if (onValidationChange) {
          const validation = validateBlock(updatedBlock);
          onValidationChange(validation.isValid, validation.errors);
        }
      };

      return (
        <DividerBlockEditor
          data={block.data as DividerData}
          onChange={handleDividerChange}
          onValidationChange={handleEditorValidationChange}
        />
      );
    }

    case 'images':
    case 'resume':
    case 'carousel':
      // These editors would be more complex and require additional props
      // For now, return a placeholder
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#6c757d' }}>
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block Editor
          </h4>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>
            Editor for {block.type} blocks will be implemented in a future task
          </p>
        </div>
      );

    default:
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#fff3cd',
          border: '2px solid #ffeaa7',
          borderRadius: '8px',
          margin: '1rem 0'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>
            Unknown Block Type
          </h4>
          <p style={{ margin: 0, color: '#856404', fontSize: '0.875rem' }}>
            No editor available for block type: {(block as any).type}
          </p>
        </div>
      );
  }
};