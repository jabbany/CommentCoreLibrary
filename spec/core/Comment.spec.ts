import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CommentManager, CoreComment, ScrollComment } from 'comment-core-library';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CoreComment', () => {
  var manager = null;

  beforeEach(() => {
    manager = new CommentManager(document.createElement('div'));
  });

  it('cannot initialize without parent', () => {
    expect(CoreComment).toThrow();
  });

  it('initializes defaults from empty IComment', () => {
    var comment = new CoreComment(manager);
    expect(comment.mode).toBe(1);
    expect(comment.text).toBe('');
    expect(comment.ttl).toBe(4000);
    expect(comment.dur).toBe(4000);
    expect(comment.movable).toBe(true);
    expect(comment.color).toBe(0xffffff);
    expect(comment.size).toBe(25);
    expect(comment.alpha).toBe(1);
    expect(comment.border).toBe(false);
    expect(comment.align).toBe(0);
    expect(comment.parent).toBe(manager);
  });

  it('initializes from parameterized IComment', () => {
    var config = {
      stime: 100,
      mode: 2,
      dur: 5000,
      text: 'FooBar',
      color: 0xf0f0f0,
      size: 24,
      border: true,
      opacity: 0.5,
      font: 'SimSun'
    };
    var comment = new CoreComment(manager, config);

    'stime mode dur text color size border'.split(' ').forEach((property) => {
      expect(comment[property]).toBe(config[property]);
    });

    expect(comment.alpha).toBe(config.opacity);
  });

  'time update finish'.split(' ').forEach((method) => {
    it('has ' + method, () => {
      var comment = new CoreComment(manager);
      expect(typeof comment[method]).toBe('function');
    });
  });

  describe('.time', () => {
    var comment = null;

    beforeEach(() => {
      var config = {
        dur: 1000
      };
      comment = new CoreComment(manager, config);
    });

    it('ages comment', () => {
      comment.time(100);
      expect(comment.ttl).toBe(comment.dur - 100);
    });

    it('calls update when movable', () => {
      var spy = vi.spyOn(comment, 'update');
      comment.time(100);
      expect(spy).toHaveBeenCalled();
    });

    it('calls finish if expired', () => {
      var spy = vi.spyOn(comment, 'finish');

      // Create the DOM and add it to the manager
      comment.init();
      comment.parent.stage.appendChild(comment.dom);

      comment.time(2000);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('.invalidate', () => {
    var comment = null;

    beforeEach(() => {
      var config = {
        dur: 1000
      };
      comment = new CoreComment(manager, config);
    });

    it('invalidates comment cache data', () => {
      comment.invalidate();
      expect(comment._x).toBe(null);
      expect(comment._y).toBe(null);
      expect(comment._width).toBe(null);
      expect(comment._height).toBe(null);
    });
  });

  describe('.update', () => {
    it('calls animate', () => {
      var comment = new CoreComment(manager);
      var spy = vi.spyOn(comment, 'animate');
      comment.update();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('.LINEAR', () => {
    it('does linear interpolation', () => {
      var v = CoreComment.LINEAR(400, 1, 1, 4000);
      expect(v).toBe(1.1);
    });
  });
});

describe('ScrollComment', () => {
  var manager = null;

  beforeEach(() => {
    manager = new CommentManager(document.createElement('div'));
  });

  it('cannot initialize without parent', () => {
    expect(ScrollComment).toThrow();
  });

  it('applies scaling for scroll comments', () => {
    manager.options.scroll.scale = 10;
    var config = {
      dur: 4000
    };
    var comment = new ScrollComment(manager, config);
    expect(comment.dur).toBe(40000);
  });
});
