import type { Organization } from '@/lib/holodex';

export interface OrganizationRow {
  id: string;
  name: string;
  channel_id: string;
  created_at: string;
}

export function mockOrganization(
  overrides: Partial<Organization> = {},
): Organization {
  return {
    id: 'Nijisanji',
    name: 'にじさんじ',
    channelId: 'UCX7YkU9nEeaoZbkVLVajcMg',
    ...overrides,
  };
}

export function mockOrganizationRow(
  overrides: Partial<OrganizationRow> = {},
): OrganizationRow {
  return {
    id: 'Nijisanji',
    name: 'にじさんじ',
    channel_id: 'UCX7YkU9nEeaoZbkVLVajcMg',
    created_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}
