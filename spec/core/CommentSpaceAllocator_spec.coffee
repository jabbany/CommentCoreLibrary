'use strict'
describe 'CommentSpaceAllocators', ->
  scrollCSA = anchorCSA = manager = stage = c1 = c2 = s1 = s2 = null

  describe 'instance ISpaceAllocator and descendants', ->
    beforeEach ->
      scrollCSA = new CommentSpaceAllocator(400,300)
      anchorCSA = new AnchorCommentSpaceAllocator(400,300)
      stage = document.createElement 'DIV'
      manager = new CommentManager(stage)
      manager.init()
      c1 = new CoreComment(manager, {})
      c2 = new CoreComment(manager, {})
      s1 = new ScrollComment(manager, {})
      s2 = new ScrollComment(manager, {})
      c1.init();
      c2.init();
      s1.init();
      s2.init();

    'add remove setBounds'.split(' ').forEach (method)->
      it "Has method: '#{method}'", ->
        expect(typeof scrollCSA[method]).toBe 'function'
        expect(typeof anchorCSA[method]).toBe 'function'

    'willCollide pathCheck'.split(' ').forEach (method)->
      it "Has path-based allocation method: '#{method}'", ->
        expect(typeof scrollCSA[method]).toBe 'function'
        expect(typeof anchorCSA[method]).toBe 'function'
 
    it 'successful initialization of comment manager', ->
       expect(manager).not.toBe null

    describe 'AnchorCommentSpaceAllocator', ->
      it 'comments always collide', ->
        expect(anchorCSA.willCollide(c1, c2)).toBe true

      it 'same comment must collide with self', ->
        expect(anchorCSA.willCollide(c1, c1)).toBe true
        expect(anchorCSA.willCollide(c2, c2)).toBe true

      it 'path check passes for y = 0 in empty pool', ->
        expect(anchorCSA.pathCheck(0, c1, [])).toBe true

      it 'path check fails for y = 0 in self pool', ->
        expect(anchorCSA.pathCheck(0, c1, [c1])).toBe false

      it 'path check fails for y = height + 1 in self pool', ->
        expect(anchorCSA.pathCheck(c1.height + 1, c1, [c1])).toBe true

      it 'removal for cindex < 0', ->
        c1.cindex = -1
        expect(typeof anchorCSA.remove(c1)).toBe 'undefined'

      it 'removal for cindex < 0', ->
        c1.cindex = -1
        expect(typeof anchorCSA.remove(c1)).toBe 'undefined'
      # TODO: We need more extensive test cases

    describe 'CommentSpaceAllocator', ->
      it 'same comment must collide with self', ->
        expect(scrollCSA.willCollide(s1, s1)).toBe true
        expect(scrollCSA.willCollide(s2, s2)).toBe true

      it 'path check passes for y = 0 in empty pool', ->
        expect(scrollCSA.pathCheck(0, s1, [])).toBe true

      it 'path check passes for y = 0 in self pool', ->
        expect(scrollCSA.pathCheck(0, s1, [s1])).toBe false

      it 'path check passes for y = height + 1 in self pool', ->
        expect(scrollCSA.pathCheck(s1.height + 1, s1, [s1])).toBe true

      it 'removal for cindex < 0', ->
        s1.cindex = -1
        expect(typeof scrollCSA.remove(s1)).toBe 'undefined'

      it 'removal for cindex < 0', ->
        s1.cindex = -1
        expect(typeof scrollCSA.remove(s1)).toBe 'undefined'
      # TODO: We need more extensive test cases
