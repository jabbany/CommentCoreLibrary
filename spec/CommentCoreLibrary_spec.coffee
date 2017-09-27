'use strict'

describe 'CommentManager', ->
  manager = stage = cmt = c1 = c2 = c3 = c4 = c5 = null

  describe 'instance API', ->
    beforeEach ->
      c1 =
        stime: 1
        mode: 1
      c2 =
        stime: 2
        mode: 1
        date: '2014-07-12T04:35:55.624Z'
      c3 =
        stime: 2
        mode: 1
        date: '2014-07-12T04:35:55.626Z'
        dbid: '53c0bb2b6465625061b40698'
      c4 =
        stime: 2
        mode: 1
        date: '2014-07-12T04:35:55.626Z'
        dbid: '53c0bb2b6465625061b40700'
      c5 =
        stime: 2
        mode: 1
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
    insert load onTimerEvent rescale seek send
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

      it 'smoking test', ->
        jasmine.getFixtures().fixturesPath = "test/"
        json = JSON.parse readFixtures 'ac940133.json'
        comments = (new AcfunFormat.JSONParser()).parseMany json
        # TODO: Construct a json that cover all types of comments
        # and use it for smoking test
        manager.load comments
        expect(manager.timeline.length).toBe 2146

    describe '.send', ->
      it 'sends to runline' , ->
        expect(manager.runline.length).toBe 0
        manager.send cmt
        expect(manager.runline.length).toBe 1

    describe '.time', ->
      it 'allocates comments to the runline', ->
        spy = sinon.spy manager, 'send'
        manager.load [ c3, c4, c5 ]
        manager.time 3
        expect(spy).toHaveBeenCalledThrice()

      it 'limits based on limiter', ->
        spy = sinon.spy manager, 'send'
        manager.load [ c3, c4, c5 ]
        manager.options.limit = 2
        manager.time 3
        expect(spy).toHaveBeenCalledTwice()

      it 'seeks if seek threshold is passed', ->
        manager.load [ c1 ]
        manager.options.seekTrigger = 100
        manager.time 0
        manager.time 200
        expect(manager.runline.length).toBe 0

    describe '.start', ->
      it 'starts the timer', ->
        spy = sinon.spy window, 'setInterval'
        manager.start()
        expect(spy).toHaveBeenCalled true

    describe '.stop', ->
      it 'stops the timer', ->
        spy = sinon.spy window, 'clearInterval'
        manager.stop()
        expect(spy).toHaveBeenCalled true

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

    describe '.setBounds', ->
      beforeEach ->
        manager.stage.style.width = '640px'
        manager.stage.style.width = '480px'

      it 'updates width and height', ->
        manager.setBounds()
        expect(manager.width).toEqual stage.offsetWidth
        expect(manager.height).toEqual stage.offsetHeight

      it 'dispatches resize event', ->
        callback = sinon.spy()
        manager.addEventListener 'resize', callback
        manager.setBounds()
        expect(callback).toHaveBeenCalled true

      it 'sets bounds on comment space allocators', ->
        spies = {}
        for allocatorName, allocator of manager.csa
          spies[allocatorName] = sinon.spy allocator, 'setBounds'
        manager.setBounds()
        for allocatorName, spy of spies
          expect(spy).toHaveBeenCalledWith stage.offsetWidth, stage.offsetHeight

    describe '.addEventListener .dispatchEvent', ->
      it 'add one event listener', ->
        callback = sinon.spy()
        manager.addEventListener 'myCustomEvent', callback
        manager.dispatchEvent 'myCustomEvent'
        expect(callback).toHaveBeenCalled true

      it 'add multiple event listeners', ->
        dispatchedEventId = 0
        manager.addEventListener 'myCustomEvent', ->
          dispatchedEventId = 1
        manager.addEventListener 'myCustomEvent', ->
          dispatchedEventId = 2
        manager.dispatchEvent 'myCustomEvent'
        expect(dispatchedEventId).toBe 2

      it 'dispatch event works with data', ->
        callback = sinon.spy()
        manager.addEventListener 'myCustomEvent', callback
        manager.dispatchEvent 'myCustomEvent', 'foo'
        expect(callback).toHaveBeenCalledWith 'foo'
