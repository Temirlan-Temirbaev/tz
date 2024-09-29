import { User } from './user';
import { Notification } from './notification';
import { Signature } from './signature';

export class Document {
  document_id: string;
  document_name: string;
  document_url: string;
  status: "pending" | "accepted" | "denied";
  owner: User;
  created_at: Date;
  accepter: User | null;
  accepted_at: Date | null;
  notification: Notification;
  signature: Signature
}