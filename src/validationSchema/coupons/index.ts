import * as yup from 'yup';

export const couponValidationSchema = yup.object().shape({
  name: yup.string().required(),
  value: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
});
