import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User, Document } from './';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number;
  @OneToMany(() => User, user => user.notifications)
  user: User;
  @OneToOne(() => Document, document => document.notification)
  document: Document;
  @Column({default: false})
  is_read: boolean;
  @CreateDateColumn()
  created_at: Date;
}