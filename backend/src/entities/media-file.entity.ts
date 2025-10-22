import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export interface MediaFileUrls {
  original: string;
  thumbnail: string;
  mobile: string;
  desktop: string;
}

export interface MediaFileMetadata {
  size: number;
  mimeType: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ProjectDetails {
  title: string;
  description?: string;
  tags?: string[];
  year?: number;
}

@Entity('media_files')
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  portfolioId?: string;

  @Column()
  originalName: string;

  @Column({ type: 'jsonb' })
  urls: MediaFileUrls;

  @Column({ type: 'jsonb' })
  metadata: MediaFileMetadata;

  @Column({ type: 'jsonb', nullable: true })
  projectDetails?: ProjectDetails;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Note: Portfolio relationship will be added when Portfolio entity is created
  // @ManyToOne(() => Portfolio, portfolio => portfolio.mediaFiles)
  // @JoinColumn({ name: 'portfolioId' })
  // portfolio?: Portfolio;
}