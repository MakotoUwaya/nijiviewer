import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatVideoDuration, getStarted, getVideoStatusText } from './holodex';

describe('holodex utils', () => {
  describe('getStarted', () => {
    beforeEach(() => {
      // Set a fixed "now" for reliable testing
      // 2024-01-15 12:00:00 JST
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00+09:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return empty string if target is undefined', () => {
      expect(getStarted(undefined)).toBe('');
    });

    it('should return relative time if target is today (same day)', () => {
      // 2024-01-15 13:00:00 JST (1 hour later)
      const target = '2024-01-15T13:00:00.000+09:00'; 
      // Note: toRelative depends on potential timezone differences and exact implementation of luxon relative time.
      // But typically "in 1 hour" or similar.
      // Let's check if it returns a string and not the fixed format.
      // Luxon's toRelative() usually outputs something like "in 1 hour" or "1 hour ago".
      
      const result = getStarted(target);
      expect(result).not.toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/); // Should not match yyyy-MM-dd HH:mm
      expect(result).toBeTruthy();
    });
    
    it('should return formatted date if target is previous day', () => {
        // 2024-01-14 10:00:00 JST (yesterday)
        // Let's explicitly use a date that is definitely "yesterday" relative to the mocked now.
        const targetDate = DateTime.now().setZone('Asia/Tokyo').minus({ days: 1 }).set({ hour: 10, minute: 0 }).toISO({ includeOffset: true });
        expect(targetDate).toBeTruthy();
        const result = getStarted(targetDate as string);
        
        // Expected format: yyyy-MM-dd HH:mm
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });
  });

  describe('getVideoStatusText', () => {
     beforeEach(() => {
      // Mock time: 2024-01-15 10:00:00 JST
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T10:00:00+09:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return default message if start_scheduled is undefined', () => {
      expect(getVideoStatusText(undefined)).toBe('Will probably start soon');
    });

    it('should return "will start soon" if starts within 1 minute', () => {
        // Now: 10:00 JST
        // Target: 10:00:30 JST
        const target = DateTime.now().setZone('Asia/Tokyo').plus({ seconds: 30 }).toISO({ includeOffset: true });
        expect(target).toBeTruthy();
        const result = getVideoStatusText(target as string);
        expect(result).toContain('(will start soon)');
    });

    it('should return "starts in X minutes" if starts between 1 and 60 minutes', () => {
        // Now: 10:00 JST
        // Target: 10:30 JST
        const target = DateTime.now().setZone('Asia/Tokyo').plus({ minutes: 30 }).toISO({ includeOffset: true });
        expect(target).toBeTruthy();
        const result = getVideoStatusText(target as string);
        expect(result).toContain('(starts in 30 minutes)');
    });

    it('should return "starts in X hours" if starts between 1 and 24 hours', () => {
        // Now: 10:00 JST
        // Target: 12:00 JST (2 hours)
        const target = DateTime.now().setZone('Asia/Tokyo').plus({ hours: 2 }).toISO({ includeOffset: true });
        expect(target).toBeTruthy();
        const result = getVideoStatusText(target as string);
        expect(result).toContain('(starts in 2 hours)');
    });

    it('should return only "Start at ..." if starts after 24 hours', () => {
        // Now: 10:00 JST
        // Target: 2 days later JST
        const target = DateTime.now().setZone('Asia/Tokyo').plus({ days: 2 }).toISO({ includeOffset: true });
        expect(target).toBeTruthy();
        const result = getVideoStatusText(target as string);
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
