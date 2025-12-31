// cSpell:disable
import type { Organization } from '@/lib/holodex';

const organizations = {
  Nijisanji: {
    id: 'Nijisanji',
    name: 'にじさんじ',
    channelId: 'UCX7YkU9nEeaoZbkVLVajcMg',
  },
  Hololive: {
    id: 'Hololive',
    name: 'ホロライブ',
    channelId: 'UCJFZiqLMntJufDCHc6bQixg',
  },
  VSpo: {
    id: 'VSpo',
    name: 'ぶいすぽ',
    channelId: 'UCuI5XaO-6VkOEhHao6ij7JA',
  },
  'Neo-Porte': {
    id: 'Neo-Porte',
    name: 'ネオポルテ',
    channelId: 'UCm5rjZAFQuRrnDCkxnwvWkg',
  },
  '774inc': {
    id: '774inc',
    name: 'ななしいんく',
    channelId: 'UCJEpkwwDiTKS5lxwFttEbIQ',
  },
  Varium: {
    id: 'Varium',
    name: 'ぶいありうむ',
    channelId: 'UCAytwphRHoPcvLr_qRvn3Zw',
  },
} as const satisfies Record<string, Organization>;
export type OrganizationId = keyof typeof organizations;

export const organizationMap = Object.values(organizations);
