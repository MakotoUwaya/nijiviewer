import type { Channel } from '@/lib/holodex';

export type LiverExternalLink = {
  label: string;
  url: string;
  kind: 'official-store';
};

type OrganizationLiverLinkResolver = (channel: Channel) => LiverExternalLink[];

const nijisanjiStoreIdsByChannelId: Record<string, string> = {
  'UC_4QF0dL-9XI9VajsNkMtmQ': '1186',
};

const organizationLinkResolvers: Record<string, OrganizationLiverLinkResolver> =
  {
    Nijisanji: (channel) => {
      const storeId = nijisanjiStoreIdsByChannelId[channel.id];

      if (!storeId) {
        return [];
      }

      return [
        {
          label: 'にじさんじオフィシャルストア',
          url: `https://shop.nijisanji.jp/${storeId}`,
          kind: 'official-store',
        },
      ];
    },
  };

export function getLiverExternalLinks(channel: Channel): LiverExternalLink[] {
  if (!channel.org) {
    return [];
  }

  return organizationLinkResolvers[channel.org]?.(channel) ?? [];
}

/**
 * inui-fansite (https://inui-fansite.mukwty.com) に楽曲・歌枠が登録されているライバーのマッピング
 */
export const inuiFansSingersByChannelId: Record<string, string> = {
  'UCXRlIK3Cw_TJIQC5kSJJQMg': '戌亥とこ',
  'UC0xry7czPasj1wPxR8L0MZg': '早乙女ベリー',
  'UCkhViRjLUKgIcVpar9JiNrw': '珠乃井ナナ',
  'UCo7TRj3cS-f_1D9ZDmuTsjw': '町田ちま',
  'UCHVXbQzkl3rDfsXWo8xi2qw': 'アンジュ・カトリーナ',
  'UCZ1xuCK1kNmn5RzPYIZop3w': 'リゼ・ヘルエスタ',
  'UCXW4MqCQn-jCaxlX-nn-BYg': '長尾景',
  'UCGw7lrT-rVZCWHfdG9Frcgg': '弦月藤士郎',
  'UCo2N7C-Z91waaR6lF3LL_jw': '甲斐田晴',
  'UCt5-0i4AVHXaWJrL8Wql3mw': '緑仙',
  'UC4l9gz3q65lTBFfFtW5LLeA': '渡会雲雀',
  'UCambvP8yxNDot4FzQc9cgiw': '宇佐美リト',
  'UCz89MGFBrAqwJ5xMr5weSuA': '伊波ライ',
  'UCYkmXr1qzHgYmCYosUJ0ABw': '榊ネス',
  'UCiA-trSZfB0i92V_-dyDqBw': '倉持めると',
  'UCUP8TmlO7NNra88AMqGU_vQ': '小清水透',
  'UCuep1JCrMvSxOGgGhBfJuYw': 'フレン・E・ルスタリオ',
  'UCzNXpqpdvlibmNc1JpM1o4g': 'ルンルン',
  'UCpEDglLnIshEMa5n1vepVeg': '樋口楓',
  'UCPvGypSgfDkVe7JG2KygK7A': '竜胆尊',
  'UC53UDnhAAYwvNO7j_2Ju1cQ': 'ドーラ',
  'UCbc8fwhdUNlqi-J99ISYu4A': 'ベルモンド・バンデラス',
  'UCTIE7LM5X15NVugV7Krp9Hw': '夢追翔',
  'UCNW1Ex0r6HsWRD4LCtPwvoQ': '三枝明那',
  'UCGYAYLDE7TZiiC8U6teciDQ': '葉加瀬冬雪',
  'UCe_p3YEuYJb8Np0Ip9dk-FQ': '朝日南アカネ',
  'UCebT4Aq-3XWb5je1S1FvR_A': '東堂コハク',
  'UCC7rRD6P7RQcx0hKv9RQP4w': '風楽奏斗',
  'UCqXxS-9x9Ha_UiH6hG4kh5Q': '緋八マナ',
  'UCcx3crxPFi006DUhb_YU-tw': '北見遊征',
  'UCnbJ8LTbHrsRgqkxwJXCU8w': '立伝都々',
  'UCpjypWF_wNRs9_TrjjWngpQ': '渚トラウト',
  'UCIq2HwA2iBOso7ar4VuU-TA': '蝸堂みかる',
  'UCHVSA2OScyef9W7OwPGgJ9w': '城瀬いすみ',
  'UCkIimWZ9gBJRamKF0rmPU8w': '天宮こころ',
  'UC_a1IKPxyZ53p3i8_4t1Y-g': '鈴原るる',
  'UCIeSUTOTkF9Hs7q3SGcO-Ow': 'Elira Pendora',
  'UCu-J8uIXuLZh16gG-cT1naw': 'Finana Ryugu',
  'UC7Gb7Uawe20QyFibhLl1lzA': 'Luca Kaneshiro',
  'UCwaS8_S7kMiKA3izlTWHbQg': 'Maria Marionette',
  'UCy91xBlY_Brh3bnHxKtjrrg': 'Doppio Dropscythe',
  'UChKXd7oqD18qiIYBoRIHTlw': 'Meloco Kyoran',
  'UCQQwo2x7EQznEavx8cibFOQ': 'Yu Q. Wilson',
};

/**
 * inui-fansite の歌い手指定画面 URL を取得する
 */
export function getInuiFansMusicUrl(channel: Channel): string | null {
  const singerName = inuiFansSingersByChannelId[channel.id];
  if (!singerName) {
    return null;
  }
  return `https://inui-fansite.mukwty.com/singing-streams?singer=${encodeURIComponent(singerName)}`;
}
