'use strict'
describe 'CssScrollComment', ->
  manager = null

  beforeEach ->
    manager = new CommentManager(document.createElement 'div')

  it 'cannot initialize without parent', ->
    expect(CssScrollComment).toThrow()

  it 'inherits scaling for scroll comments', ->
    manager.options.scroll.scale = 10
    config = 
      dur: 4000
    comment = new CssScrollComment(manager, config)
    expect(comment.dur).toBe 40000
