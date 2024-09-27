import {User, Document} from "./";
export class Signature {
  id: number;
  user: User;
  document: Document;
  signed_at: Date;
  signature: string;
}