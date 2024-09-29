import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Document, Notification, Signature } from './';
@Entity()
export class User {
  @PrimaryColumn()
  user_id: string;
  @Column()
  name: string;
  @Column({default: 'admin'})
  role: "admin" | "user"
  @OneToMany(() => Document, document => document.owner, {cascade: true})
  documents: Document[];
  @OneToMany(() => Document, document => document.accepter, {cascade: true})
  accepted_documents: Document[];
  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];
  @OneToMany(() => Signature, (signature) => signature.user, {cascade : true})
  signatures: Signature[];
}