import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createInvite } from 'apiSdk/invites';
import { inviteValidationSchema } from 'validationSchema/invites';
import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';
import { getOrganizations } from 'apiSdk/organizations';
import { getUsers } from 'apiSdk/users';
import { InviteInterface } from 'interfaces/invite';

function InviteCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InviteInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInvite(values);
      resetForm();
      router.push('/invites');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InviteInterface>({
    initialValues: {
      invite_date: new Date(new Date().toDateString()),
      role: '',
      organization_id: (router.query.organization_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: inviteValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Invites',
              link: '/invites',
            },
            {
              label: 'Create Invite',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Invite
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="invite_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Invite Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.invite_date ? new Date(formik.values?.invite_date) : null}
              onChange={(value: Date) => formik.setFieldValue('invite_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.role}
            label={'Role'}
            props={{
              name: 'role',
              placeholder: 'Role',
              value: formik.values?.role,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            labelField={'name'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/invites')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'invite',
    operation: AccessOperationEnum.CREATE,
  }),
)(InviteCreatePage);
