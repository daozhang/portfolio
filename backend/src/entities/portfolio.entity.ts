import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { MediaFile } from './media-file.entity';

export enum PortfolioTemplate {
  GALLERY = 'gallery',
  ABOUT = 'about',
  CONTACT = 'contact',
}

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

export interface ResumeData {
  sections: {
    title: string;
    items: {
      title: string;
      subtitle?: string;
      description?: string;
      date?: string;
    }[];
  }[];
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

export type BlockData = TitleData | RichTextData | ListData | ImagesData | ResumeData | CarouselData | DividerData | LinkData;

export interface Block {
  id: string;
  type: 'title' | 'richtext' | 'list' | 'images' | 'resume' | 'carousel' | 'divider' | 'link';
  position: number;
  data: BlockData;
}

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: PortfolioTemplate,
    default: PortfolioTemplate.GALLERY,
  })
  template: PortfolioTemplate;

  @Column({ type: 'jsonb', default: [] })
  blocks: Block[];

  @Column({ default: 'default' })
  theme: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  publicUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => MediaFile, mediaFile => mediaFile.portfolio)
  mediaFiles: MediaFile[];
}