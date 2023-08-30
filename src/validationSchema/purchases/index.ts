import * as yup from 'yup';

export const purchaseValidationSchema = yup.object().shape({
  purchase_date: yup.date().required(),
  coupon_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
