import { describe, expect, it } from 'vitest';
import { mockChannel } from '@/test/fixtures/holodex';
import { getInuiFansMusicUrl, getLiverExternalLinks } from './liver-links';

describe('getLiverExternalLinks', () => {
  it('returns the Nijisanji official store link for Rei7', () => {
    const links = getLiverExternalLinks(
      mockChannel({
        id: 'UC_4QF0dL-9XI9VajsNkMtmQ',
        org: 'Nijisanji',
      }),
    );

    expect(links).toEqual([
      {
        label: 'にじさんじオフィシャルストア',
        url: 'https://shop.nijisanji.jp/1186',
        kind: 'official-store',
      },
    ]);
  });

  it('returns no links when the organization has no resolver', () => {
    const links = getLiverExternalLinks(
      mockChannel({
        id: 'channel-1',
        org: 'Indie',
      }),
    );

    expect(links).toEqual([]);
  });
});

describe('getInuiFansMusicUrl', () => {
  it('returns music link with channel ID for any valid channel', () => {
    const url = getInuiFansMusicUrl(
      mockChannel({
        id: 'UCXRlIK3Cw_TJIQC5kSJJQMg',
      }),
    );

    expect(url).toBe(
      `https://inui-fansite.mukwty.com/singing-streams?channel=${encodeURIComponent('UCXRlIK3Cw_TJIQC5kSJJQMg')}`,
    );
  });

  it('returns null when channel has no ID', () => {
    const url = getInuiFansMusicUrl(
      mockChannel({
        id: '',
      }),
    );

    expect(url).toBeNull();
  });
});
