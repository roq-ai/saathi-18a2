import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ChatInterface {
  id?: string;
  content: string;
  is_anonymous: boolean;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface ChatGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  user_id?: string;
}
