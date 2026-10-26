import { describe, it, expect, beforeEach } from 'vitest';
import { CommentManager, CssScrollComment } from 'comment-core-library';

describe('CssScrollComment', () => {
  var manager = null;

  beforeEach(() => {
    manager = new CommentManager(document.createElement('div'));
  });

  it('cannot initialize without parent', () => {
    expect(CssScrollComment).toThrow();
  });

  it('inherits scaling for scroll comments', () => {
    manager.options.scroll.scale = 10;
    var config = {
      dur: 4000
    };
    var comment = new CssScrollComment(manager, config);
    expect(comment.dur).toBe(40000);
  });
});
