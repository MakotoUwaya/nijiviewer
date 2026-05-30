import { describe, expect, it } from 'vitest';
import { mockChannel } from '@/test/fixtures/holodex';
import { getLiverExternalLinks } from './liver-links';

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
