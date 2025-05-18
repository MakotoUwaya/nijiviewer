import type { Organization } from '@/lib/holodex';

declare global {
  interface Window {
    gtag: (
      command: 'event',
      eventName: string,
      eventParameters: Record<string, unknown>,
    ) => void;
  }
}

export const sendOrganizationChangeEvent = (organization: Organization) => {
  window.gtag?.('event', 'select_organization', {
    organization_id: organization.id,
    organization_name: organization.name,
  });
};
