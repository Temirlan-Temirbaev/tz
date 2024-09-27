import {Document, Notification} from './';
import { Signature } from './signature';

export class User {
  user_id: string;
  name: string;
  role: "user" | "admin";
  documents: Document[];
  notifications: Notification[];
  signatures: Signature[]
}