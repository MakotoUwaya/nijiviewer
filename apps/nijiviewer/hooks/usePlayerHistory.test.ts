import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayerHistory } from './usePlayerHistory';

describe('usePlayerHistory', () => {
  let pushStateSpy: ReturnType<typeof vi.spyOn>;
  let backSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushStateSpy = vi.spyOn(window.history, 'pushState');
    backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Reset history state between tests so prior `pushState` does not leak.
    window.history.replaceState(null, '');
  });

  it('pushes state when opened, only once for repeat opens', () => {
    const onClose = vi.fn();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        usePlayerHistory(isOpen, onClose),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });
    expect(pushStateSpy).toHaveBeenCalledTimes(1);
    expect(pushStateSpy).toHaveBeenCalledWith({ inAppPlayer: true }, '');

    // Re-render with same isOpen=true should not push again.
    rerender({ isOpen: true });
    expect(pushStateSpy).toHaveBeenCalledTimes(1);
  });

  it('navigates back when closed programmatically while inAppPlayer state is current', () => {
    const onClose = vi.fn();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        usePlayerHistory(isOpen, onClose),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });
    rerender({ isOpen: false });

    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call back when current history state lacks inAppPlayer', () => {
    const onClose = vi.fn();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        usePlayerHistory(isOpen, onClose),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });

    // Simulate history state being replaced (e.g., another navigation) before close.
    window.history.replaceState(null, '');
    rerender({ isOpen: false });

    expect(backSpy).not.toHaveBeenCalled();
  });

  it('calls onClose when popstate fires without inAppPlayer state while open', () => {
    const onClose = vi.fn();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        usePlayerHistory(isOpen, onClose),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when popstate fires with inAppPlayer state', () => {
    const onClose = vi.fn();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        usePlayerHistory(isOpen, onClose),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });

    act(() => {
      window.dispatchEvent(
        new PopStateEvent('popstate', { state: { inAppPlayer: true } }),
      );
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when popstate fires while closed', () => {
    const onClose = vi.fn();
    renderHook(() => usePlayerHistory(false, onClose));

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('removes the popstate listener on unmount', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    const onClose = vi.fn();
    const { unmount } = renderHook(() => usePlayerHistory(true, onClose));

    unmount();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function),
    );
  });
});
