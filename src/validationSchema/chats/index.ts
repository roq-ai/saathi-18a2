import * as yup from 'yup';

export const chatValidationSchema = yup.object().shape({
  content: yup.string().required(),
  is_anonymous: yup.boolean().required(),
  user_id: yup.string().nullable().required(),
});
