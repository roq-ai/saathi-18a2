interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: ['Customer'],
  tenantRoles: ['Business Owner', 'Team Member', 'Customer Service Representative'],
  tenantName: 'Organization',
  applicationName: 'Saathi',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [
    'Purchase recharge coupons',
    'Manage chats with other users',
    'Chat anonymously with other users',
    'View available recharge coupons and balance',
  ],
  ownerAbilities: [
    'Manage an Organization',
    'Invite Team Members and Customer Service Representatives',
    'Manage recharge coupons',
    'Manage roles of Team Members and Customer Service Representatives',
  ],
};
