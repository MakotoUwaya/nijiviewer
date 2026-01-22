import { DateTime, Settings } from 'luxon';
import { beforeEach, describe, expect, test } from 'vitest';

import { hasPast, isStale } from './videos';

describe("hasPast's test", () => {
  beforeEach(() => {
    const timeTravel = DateTime.fromISO('2024-08-15T09:25:00.000Z');
    Settings.now = () => timeTravel.toMillis();
  });
  test('Return true if the current time is past the streaming start time', () => {
    expect(hasPast('2024-08-15T09:24:59.000Z')).toBe(true);
  });
  test('Return false if the current time is not past the streaming start time', () => {
    expect(hasPast('2024-08-15T09:25:00.000Z')).toBe(false);
  });
});

describe("isStale's test", () => {
  beforeEach(() => {
    // Current time: 2024-08-15T09:25:00.000Z
    const timeTravel = DateTime.fromISO('2024-08-15T09:25:00.000Z');
    Settings.now = () => timeTravel.toMillis();
  });

  test('Return true if time is more than 1 hour ago', () => {
    // 08:24 is more than 1 hour before 09:25
    expect(isStale('2024-08-15T08:24:00.000Z')).toBe(true);
  });

  test('Return false if time is less than 1 hour ago', () => {
    // 08:26 is less than 1 hour before 09:25
    expect(isStale('2024-08-15T08:26:00.000Z')).toBe(false);
  });

  test('Return false if time is in the future', () => {
    expect(isStale('2024-08-15T09:30:00.000Z')).toBe(false);
  });

  test('Return false if target is undefined', () => {
    expect(isStale(undefined)).toBe(false);
  });
});
