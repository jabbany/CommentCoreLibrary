'use strict'
describe 'CommentManager', ->
  manager = null

  describe 'instance API', ->
    beforeEach ->
      manager = new CommentManager(window)

    'load start stop insert send clear time'.split(' ').forEach (method)->
      it "has method: '#{method}'", ->
        expect(typeof manager[method]).toBe 'function'

