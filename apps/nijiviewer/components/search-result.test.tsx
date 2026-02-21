import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { getElapsedTime } from './search-result';

describe('getElapsedTime', () => {
  beforeAll(() => {
    // 2024年3月30日に固定
    vi.setSystemTime(new Date('2024-03-30'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test('年と月の両方がある場合', () => {
    const result = getElapsedTime('2023-01-15'); // 1年2ヶ月
    expect(result).toBe('(1年2ヵ月)');
  });

  test('年のみの場合', () => {
    const result = getElapsedTime('2023-03-15'); // 1年0ヶ月
    expect(result).toBe('(1年)');
  });

  test('月のみの場合', () => {
    const result = getElapsedTime('2023-12-15'); // 3ヶ月
    expect(result).toBe('(3ヵ月)');
  });

  test('経過時間がない場合', () => {
    const result = getElapsedTime('2024-03-15'); // 同じ月
    expect(result).toBe('');
  });

  test('月をまたぐ場合の年の調整', () => {
    const result = getElapsedTime('2023-12-15'); // 2023年12月 → 2024年3月
    expect(result).toBe('(3ヵ月)');
  });

  test('年末から年始にかけての計算', () => {
    vi.setSystemTime(new Date('2024-02-15'));
    const result = getElapsedTime('2023-12-15'); // 2023年12月 → 2024年2月
    expect(result).toBe('(2ヵ月)');
  });
});
