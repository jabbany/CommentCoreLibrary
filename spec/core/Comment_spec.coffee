'use strict'
describe 'CoreComment', ->
  manager = null

  beforeEach ->
    manager = new CommentManager(document.createElement 'div')

  it 'cannot initialize without parent', ->
    expect(CoreComment).toThrow()

  it 'initializes defaults from empty IComment', ->
    comment = new CoreComment(manager)
    expect(comment.mode).toBe 1
    expect(comment.text).toBe ''
    expect(comment.ttl).toBe 4000
    expect(comment.dur).toBe 4000
    expect(comment.movable).toBe true
    expect(comment.color).toBe 0xffffff
    expect(comment.size).toBe 25
    expect(comment.alpha).toBe 1
    expect(comment.border).toBe false
    expect(comment.align).toBe 0
    expect(comment.parent).toBe manager

  it 'initializes from parameterized IComment', ->
    config = 
      stime: 100
      mode: 2
      dur: 5000
      text: 'FooBar'
      color: 0xf0f0f0
      size: 24
      border: true
      opacity: 0.5
      font: 'SimSun'
    comment = new CoreComment(manager, config)

    'stime mode dur text color size border'.split(' ').forEach (property) ->
       expect(comment[property]).toBe config[property]

    expect(comment.alpha).toBe config.opacity

  'time update finish'.split(' ').forEach (method) ->
    it "has #{method}", ->
      comment = new CoreComment(manager)
      expect(typeof comment[method]).toBe 'function'

describe 'ScrollComment', ->
  manager = null 

  beforeEach ->
    manager = new CommentManager(document.createElement 'div')

  it 'cannot initialize without parent', ->
    expect(ScrollComment).toThrow()

  it 'applies scaling for scroll comments', ->
    manager.options.scroll.scale = 10
    config = 
      dur: 4000
    comment = new ScrollComment(manager, config)
    expect(comment.dur).toBe 40000

