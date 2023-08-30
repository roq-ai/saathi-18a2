import { CouponInterface } from 'interfaces/coupon';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PurchaseInterface {
  id?: string;
  purchase_date?: any;
  coupon_id: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  coupon?: CouponInterface;
  user?: UserInterface;
  _count?: {};
}

export interface PurchaseGetQueryInterface extends GetQueryInterface {
  id?: string;
  coupon_id?: string;
  user_id?: string;
}
