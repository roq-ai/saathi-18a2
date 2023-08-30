import { PurchaseInterface } from 'interfaces/purchase';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CouponInterface {
  id?: string;
  name: string;
  value: number;
  user_id: string;
  created_at?: any;
  updated_at?: any;
  purchase?: PurchaseInterface[];
  user?: UserInterface;
  _count?: {
    purchase?: number;
  };
}

export interface CouponGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
