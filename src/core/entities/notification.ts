import { User, Document } from './';

export class Notification {
  notification_id: number;
  user: User;
  document: Document;
  is_read: boolean
}