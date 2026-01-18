import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatVideoDuration, getStarted, getVideoStatusText } from './holodex';

describe('holodex utils', () => {
  describe('getStarted', () => {
    beforeEach(() => {
      // Set a fixed "now" for reliable testing
      // 2024-01-15 12:00:00
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return empty string if target is undefined', () => {
      expect(getStarted(undefined)).toBe('');
    });

    it('should return relative time if target is today (same day)', () => {
      // 2024-01-15 13:00:00 (1 hour later)
      const target = '2024-01-15T13:00:00.000Z'; 
      // Note: toRelative depends on potential timezone differences and exact implementation of luxon relative time.
      // But typically "in 1 hour" or similar.
      // Let's check if it returns a string and not the fixed format.
      // Luxon's toRelative() usually outputs something like "in 1 hour" or "1 hour ago".
      
      const result = getStarted(target);
      expect(result).not.toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/); // Should not match yyyy-MM-dd HH:mm
      expect(result).toBeTruthy();
    });
    
    it('should return formatted date if target is previous day', () => {
        // 2024-01-14 23:00:00 (yesterday)
        const target = '2024-01-14T23:00:00.000'; // ISO string without Z, treated as local in Luxon if not specified? 
        // Note: holodex.ts uses DateTime.fromISO(target).
        // If the string has no offset, Luxon uses local system zone.
        // To avoid timezone confusion in tests, robust to specify ISO with offset or Z.
        // However, isPreviousDay compares against "now" start of day.
        
        // Let's explicitly use a date that is definitely "yesterday" relative to the mocked now.
        const targetDate = DateTime.now().minus({ days: 1 }).set({ hour: 10, minute: 0 }).toISO();
        const result = getStarted(targetDate!);
        
        // Expected format: yyyy-MM-dd HH:mm
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });
  });

  describe('getVideoStatusText', () => {
     beforeEach(() => {
      // Mock time: 2024-01-15 10:00:00
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T10:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return default message if start_scheduled is undefined', () => {
      expect(getVideoStatusText(undefined)).toBe('Will probably start soon');
    });

    it('should return "will start soon" if starts within 1 minute', () => {
        // Now: 10:00
        // Target: 10:01
        const target = DateTime.now().plus({ seconds: 30 }).toISO();
        const result = getVideoStatusText(target!);
        expect(result).toContain('(will start soon)');
    });

    it('should return "starts in X minutes" if starts between 1 and 60 minutes', () => {
        // Now: 10:00
        // Target: 10:30
        const target = DateTime.now().plus({ minutes: 30 }).toISO();
        const result = getVideoStatusText(target!);
        expect(result).toContain('(starts in 30 minutes)');
    });

    it('should return "starts in X hours" if starts between 1 and 24 hours', () => {
        // Now: 10:00
        // Target: 12:00 (2 hours)
        const target = DateTime.now().plus({ hours: 2 }).toISO();
        const result = getVideoStatusText(target!);
        expect(result).toContain('(starts in 2 hours)');
    });

    it('should return only "Start at ..." if starts after 24 hours', () => {
        // Now: 10:00
        // Target: 2 days later
        const target = DateTime.now().plus({ days: 2 }).toISO();
        const result = getVideoStatusText(target!);
        expect(result).not.toContain('(starts in');
        expect(result).not.toContain('(will start soon)');
        expect(result).toMatch(/^Start at \d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });
  });

  describe('formatVideoDuration', () => {
    it('should format duration less than 1 hour as MM:SS', () => {
      // 5 minutes 30 seconds = 330 seconds
      expect(formatVideoDuration(330)).toBe('05:30');
    });

    it('should format duration exactly 1 hour as HH:MM:SS', () => {
        // 1 hour = 3600 seconds
        expect(formatVideoDuration(3600)).toBe('01:00:00');
    });

    it('should format duration more than 1 hour as HH:MM:SS', () => {
        // 1 hour 30 mins 45 seconds = 3600 + 1800 + 45 = 5445
        expect(formatVideoDuration(5445)).toBe('01:30:45');
    });
    
    it('should handle 0 seconds', () => {
        expect(formatVideoDuration(0)).toBe('00:00');
    });
  });
});
