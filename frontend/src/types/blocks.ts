// Block system interfaces and types for the portfolio builder

export type BlockType = 
  | 'title' 
  | 'richtext' 
  | 'list' 
  | 'images' 
  | 'resume' 
  | 'carousel' 
  | 'divider' 
  | 'link';

// Base block interface
export interface BaseBlock {
  id: string;
  type: BlockType;
  position: number;
}

// Individual block data interfaces
export interface TitleData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  alignment: 'left' | 'center' | 'right';
}

export interface RichTextData {
  content: string; // HTML content
}

export interface ListData {
  items: string[];
  type: 'ordered' | 'unordered';
}

export interface ImagesData {
  mediaFileIds: string[];
  layout: 'grid' | 'masonry' | 'single';
  columns?: number;
}

export interface ResumeSection {
  title: string;
  items: {
    title: string;
    subtitle?: string;
    description?: string;
    date?: string;
  }[];
}

export interface ResumeData {
  sections: ResumeSection[];
}

export interface CarouselData {
  mediaFileIds: string[];
  autoPlay: boolean;
  showDots: boolean;
}

export interface DividerData {
  style: 'solid' | 'dashed' | 'dotted';
  thickness: number;
  color?: string;
}

export interface LinkData {
  text: string;
  url: string;
  openInNewTab: boolean;
  style: 'button' | 'text';
}

// Typed block interfaces
export interface TitleBlock extends BaseBlock {
  type: 'title';
  data: TitleData;
}

export interface RichTextBlock extends BaseBlock {
  type: 'richtext';
  data: RichTextData;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  data: ListData;
}

export interface ImagesBlock extends BaseBlock {
  type: 'images';
  data: ImagesData;
}

export interface ResumeBlock extends BaseBlock {
  type: 'resume';
  data: ResumeData;
}

export interface CarouselBlock extends BaseBlock {
  type: 'carousel';
  data: CarouselData;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  data: DividerData;
}

export interface LinkBlock extends BaseBlock {
  type: 'link';
  data: LinkData;
}

// Union type for all blocks
export type Block = 
  | TitleBlock 
  | RichTextBlock 
  | ListBlock 
  | ImagesBlock 
  | ResumeBlock 
  | CarouselBlock 
  | DividerBlock 
  | LinkBlock;

// Block data union type
export type BlockData = 
  | TitleData 
  | RichTextData 
  | ListData 
  | ImagesData 
  | ResumeData 
  | CarouselData 
  | DividerData 
  | LinkData;

// Template types
export type TemplateType = 'gallery' | 'about' | 'contact';

// User interface (simplified for portfolio display)
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

// Media file interface
export interface MediaFile {
  id: string;
  urls: {
    original: string;
    thumbnail: string;
    mobile: string;
    desktop: string;
  };
  originalName: string;
  projectDetails?: {
    title?: string;
    description?: string;
  };
  metadata: {
    dimensions: {
      width: number;
      height: number;
    };
  };
}

// Portfolio interface
export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  template: TemplateType;
  blocks: Block[];
  theme: string;
  isPublished: boolean;
  publicUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  mediaFiles?: MediaFile[];
}