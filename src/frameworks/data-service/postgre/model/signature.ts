import {User, Document} from "./";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Signature {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.signatures)
  user: User;
  @OneToOne(() => Document, (document) => document.signature)
  document: Document;
  @CreateDateColumn()
  signed_at: Date;
  @Column()
  signature: string;
}