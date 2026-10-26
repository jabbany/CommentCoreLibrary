import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IntervalTimer, AnimationFrameTimer } from 'comment-core-library';

describe('Timers', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['Date', 'setInterval', 'clearInterval', 'setTimeout',
        'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame']
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('IntervalTimer', () => {
    it('ticks with the elapsed time', () => {
      var timer = new IntervalTimer(10);
      var callback = vi.fn();
      timer.start(callback);
      vi.advanceTimersByTime(30);
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenLastCalledWith(10);
      timer.stop();
    });

    it('does not start twice', () => {
      var timer = new IntervalTimer(10);
      var callback = vi.fn();
      timer.start(callback);
      timer.start(callback);
      vi.advanceTimersByTime(10);
      expect(callback).toHaveBeenCalledOnce();
      timer.stop();
    });

    it('stops ticking', () => {
      var timer = new IntervalTimer(10);
      var callback = vi.fn();
      timer.start(callback);
      timer.stop();
      vi.advanceTimersByTime(100);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('AnimationFrameTimer', () => {
    it('ticks once per frame with the elapsed time', () => {
      var timer = new AnimationFrameTimer();
      var callback = vi.fn();
      timer.start(callback);
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[1][0]).toBeGreaterThan(0);
      timer.stop();
    });

    it('does not start twice', () => {
      var timer = new AnimationFrameTimer();
      var callback = vi.fn();
      timer.start(callback);
      timer.start(callback);
      vi.advanceTimersToNextFrame();
      expect(callback).toHaveBeenCalledOnce();
      timer.stop();
    });

    it('stops ticking', () => {
      var timer = new AnimationFrameTimer();
      var callback = vi.fn();
      timer.start(callback);
      timer.stop();
      vi.advanceTimersToNextFrame();
      expect(callback).not.toHaveBeenCalled();
    });

    it('stops ticking when stopped from the callback', () => {
      var timer = new AnimationFrameTimer();
      var callback = vi.fn(() => timer.stop());
      timer.start(callback);
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('runs a single loop when restarted from the callback', () => {
      var timer = new AnimationFrameTimer();
      var restarted = vi.fn();
      timer.start(() => {
        timer.stop();
        timer.start(restarted);
      });
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
      expect(restarted).toHaveBeenCalledOnce();
      timer.stop();
    });

    it('falls back to setTimeout without requestAnimationFrame', () => {
      vi.stubGlobal('requestAnimationFrame', undefined);
      vi.stubGlobal('cancelAnimationFrame', undefined);
      var timer = new AnimationFrameTimer();
      var callback = vi.fn();
      timer.start(callback);
      vi.advanceTimersByTime(16);
      expect(callback).toHaveBeenCalledOnce();
      timer.stop();
      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledOnce();
    });
  });
});
