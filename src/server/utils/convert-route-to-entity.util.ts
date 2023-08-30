const mapping: Record<string, string> = {
  chats: 'chat',
  coupons: 'coupon',
  invites: 'invite',
  organizations: 'organization',
  purchases: 'purchase',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
