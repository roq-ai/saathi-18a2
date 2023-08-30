import { getServerSession } from '@roq/nextjs';
import { NextApiRequest } from 'next';
import { NotificationService } from 'server/services/notification.service';
import { convertMethodToOperation, convertRouteToEntityUtil, HttpMethod, generateFilterByPathUtil } from 'server/utils';
import { prisma } from 'server/db';

interface NotificationConfigInterface {
  roles: string[];
  key: string;
  tenantPath: string[];
  userPath: string[];
}

const notificationMapping: Record<string, NotificationConfigInterface> = {
  'coupon.create': {
    roles: ['business-owner', 'team-member'],
    key: 'coupon-created',
    tenantPath: ['organization', 'user', 'coupon'],
    userPath: [],
  },
  'coupon.update': {
    roles: ['business-owner', 'team-member'],
    key: 'coupon-updated',
    tenantPath: ['organization', 'user', 'coupon'],
    userPath: [],
  },
  'coupon.delete': {
    roles: ['business-owner', 'team-member'],
    key: 'coupon-deleted',
    tenantPath: ['organization', 'user', 'coupon'],
    userPath: [],
  },
  'chat.create': {
    roles: ['business-owner', 'team-member', 'customer-service-representative'],
    key: 'chat-created',
    tenantPath: ['organization', 'user', 'chat'],
    userPath: [],
  },
  'chat.update': {
    roles: ['business-owner', 'team-member', 'customer-service-representative'],
    key: 'chat-updated',
    tenantPath: ['organization', 'user', 'chat'],
    userPath: [],
  },
  'chat.delete': {
    roles: ['business-owner', 'team-member', 'customer-service-representative'],
    key: 'chat-deleted',
    tenantPath: ['organization', 'user', 'chat'],
    userPath: [],
  },
  'purchase.create': {
    roles: ['business-owner', 'team-member', 'customer-service-representative'],
    key: 'purchase-created',
    tenantPath: ['organization', 'user', 'purchase'],
    userPath: [],
  },
  'purchase.update': {
    roles: ['business-owner', 'team-member', 'customer-service-representative'],
    key: 'purchase-updated',
    tenantPath: ['organization', 'user', 'purchase'],
    userPath: [],
  },
  'purchase.delete': {
    roles: ['business-owner', 'team-member', 'customer-service-representative'],
    key: 'purchase-deleted',
    tenantPath: ['organization', 'user', 'purchase'],
    userPath: [],
  },
};

const ownerRoles: string[] = ['business-owner'];
const customerRoles: string[] = ['customer'];
const tenantRoles: string[] = ['business-owner', 'team-member', 'customer-service-representative'];

const allTenantRoles = tenantRoles.concat(ownerRoles);
export async function notificationHandlerMiddleware(req: NextApiRequest, entityId: string) {
  const session = getServerSession(req);
  const { roqUserId } = session;
  // get the entity based on the request url
  let [mainPath] = req.url.split('?');
  mainPath = mainPath.trim().split('/').filter(Boolean)[1];
  const entity = convertRouteToEntityUtil(mainPath);
  // get the operation based on request method
  const operation = convertMethodToOperation(req.method as HttpMethod);
  const notificationConfig = notificationMapping[`${entity}.${operation}`];

  if (!notificationConfig || notificationConfig.roles.length === 0 || !notificationConfig.tenantPath?.length) {
    return;
  }

  const { tenantPath, key, roles, userPath } = notificationConfig;

  const tenant = await prisma.organization.findFirst({
    where: generateFilterByPathUtil(tenantPath, entityId),
  });

  if (!tenant) {
    return;
  }
  const sendToTenant = () => {
    console.log('sending notification to tenant', {
      notificationConfig,
      roqUserId,
      tenant,
    });
    return NotificationService.sendNotificationToRoles(key, roles, roqUserId, tenant.tenant_id);
  };
  const sendToCustomer = async () => {
    if (!userPath.length) {
      return;
    }
    const user = await prisma.user.findFirst({
      where: generateFilterByPathUtil(userPath, entityId),
    });
    console.log('sending notification to user', {
      notificationConfig,
      user,
    });
    await NotificationService.sendNotificationToUser(key, user.roq_user_id);
  };

  if (roles.every((role) => allTenantRoles.includes(role))) {
    // check if only  tenantRoles + ownerRoles
    await sendToTenant();
  } else if (roles.every((role) => customerRoles.includes(role))) {
    // check if only customer role
    await sendToCustomer();
  } else {
    // both company and user receives
    await Promise.all([sendToTenant(), sendToCustomer()]);
  }
}
