'use strict'
describe 'CommentManager', ->
  manager = stage = cmt = c1 = c2 = c3 = c4 = c5 = null

  describe 'instance API', ->
    beforeEach ->
      c1 = stime: 1
      c2 = stime: 2, date: '2014-07-12T04:35:55.624Z'
      c3 =
        stime: 2
        date: '2014-07-12T04:35:55.626Z'
        dbid: '53c0bb2b6465625061b40698'
      c4 =
        stime: 2
        date: '2014-07-12T04:35:55.626Z'
        dbid: '53c0bb2b6465625061b40700'
      c5 =
        stime: 2
        date: '2014-07-12T04:35:55.626Z'
        dbid: '53c0bb2b6465625061b40700'
      cmt =
        stime: 124900
        color: '#fff'
        mode: 1
        size: 25
        hash: '53c0bb2b6465625061b40700'
        date: '2014-07-12T04:35:55.624Z'
        position: 13600
      stage = document.createElement 'DIV'
      manager = new CommentManager(stage)
      manager.init()

    'addEventListener clear dispatchEvent finish init
    insert load onTimerEvent rescale seek send sendComment
    setBounds start stop time validate'.split(/\s/).forEach (method)->

      it "has method: '#{method}'", ->
        expect(typeof manager[method]).toBe 'function'

    it 'sets the stage', ->
      expect(manager.stage).toBe stage

    describe '.load', ->
      it 'loads specific comment' , ->
        expect(manager.timeline).toEqual []
        manager.load [cmt]
        expect(manager.timeline).toEqual [cmt]

      it 'sorts the comments', ->
        manager.load [ c5, c2, c4, c1, c3 ]
        expect(manager.timeline).toEqual [c1, c2, c3, c4, c5]

    describe '.send', ->
      it 'sends to runline' , ->
        expect(manager.runline.length).toBe 0
        manager.send cmt
        expect(manager.runline.length).toBe 1

    describe '.start', ->
      it 'starts the timer', ->
        manager.start()
        manager.start()
        # TODO: figure out how to test the timer
        # maybe just add spy on window.setInterval

    describe '.stop', ->
      it 'stops the timer', ->
        manager.stop()
        # TODO: figure out how to test the timer
        # maybe just add spy on window.clearInterval

    describe '.clear', ->
      it 'clears', ->
        manager.send cmt
        expect(manager.runline.length).toBe 1
        manager.clear()
        expect(manager.runline.length).toBe 0

    describe '.insert', ->
      it 'inserts to right position', ->
        manager.load [c3, c5]
        expect(manager.timeline).toEqual [c3, c5]
        manager.insert c4
        expect(manager.timeline).toEqual [c3, c4 , c5]
