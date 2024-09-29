import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User, Notification, Signature } from './';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  document_id: number;
  @Column()
  document_name: string;
  @Column()
  document_url: string;
  @Column({ default: "pending" })
  status: "pending" | "accepted" | "denied";
  @CreateDateColumn()
  created_at: Date;
  @Column({nullable: true})
  accepted_at: Date;
  @ManyToOne(() => User, user => user.documents)
  owner: User;
  @ManyToOne(() => User, user => user.accepted_documents, {nullable: true})
  accepter: User;
  @OneToOne(() => Notification, notification => notification.document, {nullable: true})
  @JoinColumn()
  notification: Notification;
  @OneToOne(() => Signature, (signature) => signature.document, {nullable: true, cascade : true})
  @JoinColumn()
  signature: Signature;
}