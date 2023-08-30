import * as yup from 'yup';

export const inviteValidationSchema = yup.object().shape({
  invite_date: yup.date().required(),
  role: yup.string().required(),
  organization_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
