// Validation schemas and utilities for block data

import { 
  BlockType, 
  TitleData, 
  RichTextData, 
  ListData, 
  ImagesData, 
  ResumeData, 
  CarouselData, 
  DividerData, 
  LinkData,
  BlockData,
  Block
} from './blocks';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Validation functions for each block type
export const validateTitleData = (data: TitleData): ValidationResult => {
  const errors: string[] = [];

  if (!data.text || data.text.trim().length === 0) {
    errors.push('Title text is required');
  }

  if (data.text && data.text.length > 200) {
    errors.push('Title text must be less than 200 characters');
  }

  if (![1, 2, 3, 4, 5, 6].includes(data.level)) {
    errors.push('Title level must be between 1 and 6');
  }

  if (!['left', 'center', 'right'].includes(data.alignment)) {
    errors.push('Title alignment must be left, center, or right');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRichTextData = (data: RichTextData): ValidationResult => {
  const errors: string[] = [];

  if (!data.content || data.content.trim().length === 0) {
    errors.push('Rich text content is required');
  }

  if (data.content && data.content.length > 10000) {
    errors.push('Rich text content must be less than 10,000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateListData = (data: ListData): ValidationResult => {
  const errors: string[] = [];

  if (!data.items || data.items.length === 0) {
    errors.push('List must have at least one item');
  }

  if (data.items && data.items.length > 50) {
    errors.push('List cannot have more than 50 items');
  }

  if (data.items) {
    data.items.forEach((item, index) => {
      if (!item || item.trim().length === 0) {
        errors.push(`List item ${index + 1} cannot be empty`);
      }
      if (item && item.length > 500) {
        errors.push(`List item ${index + 1} must be less than 500 characters`);
      }
    });
  }

  if (!['ordered', 'unordered'].includes(data.type)) {
    errors.push('List type must be ordered or unordered');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateImagesData = (data: ImagesData): ValidationResult => {
  const errors: string[] = [];

  if (!data.mediaFileIds || data.mediaFileIds.length === 0) {
    errors.push('Images block must have at least one image');
  }

  if (data.mediaFileIds && data.mediaFileIds.length > 20) {
    errors.push('Images block cannot have more than 20 images');
  }

  if (!['grid', 'masonry', 'single'].includes(data.layout)) {
    errors.push('Images layout must be grid, masonry, or single');
  }

  if (data.columns && (data.columns < 1 || data.columns > 6)) {
    errors.push('Images columns must be between 1 and 6');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateResumeData = (data: ResumeData): ValidationResult => {
  const errors: string[] = [];

  if (!data.sections || data.sections.length === 0) {
    errors.push('Resume must have at least one section');
  }

  if (data.sections && data.sections.length > 10) {
    errors.push('Resume cannot have more than 10 sections');
  }

  if (data.sections) {
    data.sections.forEach((section, sectionIndex) => {
      if (!section.title || section.title.trim().length === 0) {
        errors.push(`Resume section ${sectionIndex + 1} title is required`);
      }

      if (section.title && section.title.length > 100) {
        errors.push(`Resume section ${sectionIndex + 1} title must be less than 100 characters`);
      }

      if (!section.items || section.items.length === 0) {
        errors.push(`Resume section ${sectionIndex + 1} must have at least one item`);
      }

      if (section.items && section.items.length > 20) {
        errors.push(`Resume section ${sectionIndex + 1} cannot have more than 20 items`);
      }

      if (section.items) {
        section.items.forEach((item, itemIndex) => {
          if (!item.title || item.title.trim().length === 0) {
            errors.push(`Resume section ${sectionIndex + 1}, item ${itemIndex + 1} title is required`);
          }

          if (item.title && item.title.length > 200) {
            errors.push(`Resume section ${sectionIndex + 1}, item ${itemIndex + 1} title must be less than 200 characters`);
          }

          if (item.subtitle && item.subtitle.length > 200) {
            errors.push(`Resume section ${sectionIndex + 1}, item ${itemIndex + 1} subtitle must be less than 200 characters`);
          }

          if (item.description && item.description.length > 1000) {
            errors.push(`Resume section ${sectionIndex + 1}, item ${itemIndex + 1} description must be less than 1000 characters`);
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCarouselData = (data: CarouselData): ValidationResult => {
  const errors: string[] = [];

  if (!data.mediaFileIds || data.mediaFileIds.length === 0) {
    errors.push('Carousel must have at least one image');
  }

  if (data.mediaFileIds && data.mediaFileIds.length > 10) {
    errors.push('Carousel cannot have more than 10 images');
  }

  if (typeof data.autoPlay !== 'boolean') {
    errors.push('Carousel autoPlay must be a boolean');
  }

  if (typeof data.showDots !== 'boolean') {
    errors.push('Carousel showDots must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDividerData = (data: DividerData): ValidationResult => {
  const errors: string[] = [];

  if (!['solid', 'dashed', 'dotted'].includes(data.style)) {
    errors.push('Divider style must be solid, dashed, or dotted');
  }

  if (typeof data.thickness !== 'number' || data.thickness < 1 || data.thickness > 10) {
    errors.push('Divider thickness must be a number between 1 and 10');
  }

  if (data.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(data.color)) {
    errors.push('Divider color must be a valid hex color');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLinkData = (data: LinkData): ValidationResult => {
  const errors: string[] = [];

  if (!data.text || data.text.trim().length === 0) {
    errors.push('Link text is required');
  }

  if (data.text && data.text.length > 100) {
    errors.push('Link text must be less than 100 characters');
  }

  if (!data.url || data.url.trim().length === 0) {
    errors.push('Link URL is required');
  }

  if (data.url && !URL_REGEX.test(data.url)) {
    errors.push('Link URL must be a valid HTTP or HTTPS URL');
  }

  if (typeof data.openInNewTab !== 'boolean') {
    errors.push('Link openInNewTab must be a boolean');
  }

  if (!['button', 'text'].includes(data.style)) {
    errors.push('Link style must be button or text');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Main validation function that routes to specific validators
export const validateBlockData = (type: BlockType, data: BlockData): ValidationResult => {
  switch (type) {
    case 'title':
      return validateTitleData(data as TitleData);
    case 'richtext':
      return validateRichTextData(data as RichTextData);
    case 'list':
      return validateListData(data as ListData);
    case 'images':
      return validateImagesData(data as ImagesData);
    case 'resume':
      return validateResumeData(data as ResumeData);
    case 'carousel':
      return validateCarouselData(data as CarouselData);
    case 'divider':
      return validateDividerData(data as DividerData);
    case 'link':
      return validateLinkData(data as LinkData);
    default:
      return {
        isValid: false,
        errors: [`Unknown block type: ${type}`]
      };
  }
};

// Validate entire block
export const validateBlock = (block: Block): ValidationResult => {
  const errors: string[] = [];

  // Validate base block properties
  if (!block.id || block.id.trim().length === 0) {
    errors.push('Block ID is required');
  }

  if (typeof block.position !== 'number' || block.position < 0) {
    errors.push('Block position must be a non-negative number');
  }

  // Validate block data
  const dataValidation = validateBlockData(block.type, block.data);
  if (!dataValidation.isValid) {
    errors.push(...dataValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Default data generators for each block type
export const getDefaultBlockData = (type: BlockType): BlockData => {
  switch (type) {
    case 'title':
      return {
        text: 'New Title',
        level: 2,
        alignment: 'left'
      } as TitleData;
    
    case 'richtext':
      return {
        content: '<p>Enter your text here...</p>'
      } as RichTextData;
    
    case 'list':
      return {
        items: ['List item 1'],
        type: 'unordered'
      } as ListData;
    
    case 'images':
      return {
        mediaFileIds: [],
        layout: 'grid',
        columns: 2
      } as ImagesData;
    
    case 'resume':
      return {
        sections: [{
          title: 'Experience',
          items: [{
            title: 'Job Title',
            subtitle: 'Company Name',
            description: 'Job description...',
            date: '2023 - Present'
          }]
        }]
      } as ResumeData;
    
    case 'carousel':
      return {
        mediaFileIds: [],
        autoPlay: false,
        showDots: true
      } as CarouselData;
    
    case 'divider':
      return {
        style: 'solid',
        thickness: 1,
        color: '#e0e0e0'
      } as DividerData;
    
    case 'link':
      return {
        text: 'Click here',
        url: 'https://example.com',
        openInNewTab: true,
        style: 'button'
      } as LinkData;
    
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};