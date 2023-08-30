import axios from 'axios';
import queryString from 'query-string';
import { CouponInterface, CouponGetQueryInterface } from 'interfaces/coupon';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getCoupons = async (query?: CouponGetQueryInterface): Promise<PaginatedInterface<CouponInterface>> => {
  const response = await axios.get('/api/coupons', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createCoupon = async (coupon: CouponInterface) => {
  const response = await axios.post('/api/coupons', coupon);
  return response.data;
};

export const updateCouponById = async (id: string, coupon: CouponInterface) => {
  const response = await axios.put(`/api/coupons/${id}`, coupon);
  return response.data;
};

export const getCouponById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/coupons/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCouponById = async (id: string) => {
  const response = await axios.delete(`/api/coupons/${id}`);
  return response.data;
};
