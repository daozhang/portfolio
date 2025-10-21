import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('invite_codes')
export class InviteCode {
  @PrimaryColumn()
  code: string; // 6-digit string

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isUsed: boolean;

  @Column()
  createdBy: string; // admin user ID

  @Column({ nullable: true })
  usedBy?: string; // user ID who used it

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  usedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usedBy' })
  usedByUser?: User;
}