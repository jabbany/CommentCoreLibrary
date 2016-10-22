'use strict'

describe 'CommentProvider', ->
  xhr = null
  phonyParser = null
  beforeAll ->
    xhr = sinon.useFakeXMLHttpRequest()
    phonyParser =
        parseOne: (item) -> item
        parseMany: (items) -> items

  it 'has constants', ->
    expect(CommentProvider.SOURCE_XML).toBe 'XML'
    expect(CommentProvider.SOURCE_JSON).toBe 'JSON'
    expect(CommentProvider.SOURCE_TEXT).toBe 'TEXT'

  describe '.BaseHTTPProvider', ->
    it 'produces a promise', ->
      provider = CommentProvider.BaseHttpProvider('GET', '.', 'text')
      expect(provider instanceof Promise).toBe true

  describe '.JSONProvider', ->
    it 'produces a promise', ->
      provider = CommentProvider.JSONProvider('GET', '.')
      expect(provider instanceof Promise).toBe true
    
    it 'dispatches to .BaseHTTPProvider', ->
      spy = sinon.spy CommentProvider, 'BaseHttpProvider'
      CommentProvider.JSONProvider('GET', '.', {}, '')
      expect(spy).toHaveBeenCalledWith 'GET', '.', 'json', {}, ''
      CommentProvider.BaseHttpProvider.restore()

  describe '.XMLProvider', ->
    it 'produces a promise', ->
      provider = CommentProvider.XMLProvider('GET', '.')
      expect(provider instanceof Promise).toBe true

    it 'dispatches to .BaseHTTPProvider', ->
      spy = sinon.spy CommentProvider, 'BaseHttpProvider'
      CommentProvider.XMLProvider('GET', '.', {}, '')
      expect(spy).toHaveBeenCalledWith 'GET', '.', 'document', {}, ''
      CommentProvider.BaseHttpProvider.restore()

  describe '.TextProvider', ->
    it 'produces a promise', ->
      provider = CommentProvider.TextProvider('GET', '.')
      expect(provider instanceof Promise).toBe true

    it 'dispatches to .BaseHTTPProvider', ->
      spy = sinon.spy CommentProvider, 'BaseHttpProvider'
      CommentProvider.TextProvider('GET', '.', {}, '')
      expect(spy).toHaveBeenCalledWith 'GET', '.', 'text', {}, ''
      CommentProvider.BaseHttpProvider.restore()

  describe 'instance CommentProvider', ->
    provider = null

    beforeEach ->
      provider = new CommentProvider()

    describe '.addStaticSource', ->
      it 'accepts static source', ->
        promise = {}
        provider.addStaticSource promise, CommentProvider.SOURCE_XML
        expect(provider._staticSources[CommentProvider.SOURCE_XML][0]).toBe promise

      it 'rejects if provider is shut down', ->
        provider = new CommentProvider()
        provider.destroy()
        expect( => provider.addStaticSource({}, CommentProvider.SOURCE_XML)).toThrow()

    describe '.addDynamicSource', ->
      it 'accepts dynamic source', ->
        dynamicSource =
          addEventListner: sinon.stub()
        provider.addDynamicSource dynamicSource, CommentProvider.SOURCE_XML
        expect(provider._dynamicSources[CommentProvider.SOURCE_XML][0]).toBe dynamicSource

      it 'rejects if provider is shut down', ->
        provider = new CommentProvider()
        provider.destroy()
        expect( => provider.addDynamicSource({}, CommentProvider.SOURCE_XML)).toThrow()

    describe '.addParser', ->
      it 'accepts parser', ->
        parser = {}
        provider.addParser parser, CommentProvider.SOURCE_JSON
        expect(provider._parsers[CommentProvider.SOURCE_JSON][0]).toBe parser

      it 'rejects if provider is shut down', ->
        provider = new CommentProvider()
        provider.destroy()
        expect( => provider.addParser({}, CommentProvider.SOURCE_XML)).toThrow()

    describe '.addTarget', ->
      commentManager = null
      beforeAll ->
        commentManager = new CommentManager(document.createElement 'div')

      it 'accepts target', ->
        provider.addTarget commentManager, CommentProvider.SOURCE_JSON
        expect(provider._targets.length).toBe 1
        expect(provider._targets[0]).toBe commentManager

      it 'rejects if target is not CommentManager', ->
        expect( => provider.addTarget {}).toThrow()

      it 'rejects if provider is shut down', ->
        provider = new CommentProvider()
        provider.destroy()
        expect( => provider.addTarget(commentManager)).toThrow()

    describe '.applyParsersOne', ->
      rejectingParser =
        parseOne: () -> null
        parseMany: () -> null
      resolvingParser =
        parseOne: (t) -> t
        parseMany: (t) -> t

      it 'rejects if no parsers for type', (done) ->
        promise = provider.applyParsersOne {}, CommentProvider.SOURCE_JSON
        promise.catch (e) ->
          expect(e instanceof Error).toBe true
          done()

      it 'rejects if no parser accepts', (done) ->
        provider.addParser rejectingParser, CommentProvider.SOURCE_JSON
        promise = provider.applyParsersOne {}, CommentProvider.SOURCE_JSON
        promise.catch (e) ->
          expect(e instanceof Error).toBe true
          done()

      it 'accepts if parser accepts', (done) ->
        provider.addParser resolvingParser, CommentProvider.SOURCE_JSON
        promise = provider.applyParsersOne {}, CommentProvider.SOURCE_JSON
        promise.then (item) ->
          expect(item).toEqual {}
          done()

    describe '.applyParsersList', ->
      rejectingParser =
        parseOne: () -> null
        parseMany: () -> null
      resolvingParser =
        parseOne: (t) -> t
        parseMany: (t) -> t

      it 'rejects if no parsers for type', (done) ->
        promise = provider.applyParsersList [], CommentProvider.SOURCE_JSON
        promise.catch (e) ->
          expect(e instanceof Error).toBe true
          done()

      it 'rejects if no parser accepts', (done) ->
        provider.addParser rejectingParser, CommentProvider.SOURCE_JSON
        promise = provider.applyParsersList [], CommentProvider.SOURCE_JSON
        promise.catch (e) ->
          expect(e instanceof Error).toBe true
          done()

      it 'accepts if parser accepts', (done) ->
        provider.addParser resolvingParser, CommentProvider.SOURCE_JSON
        promise = provider.applyParsersList [], CommentProvider.SOURCE_JSON
        promise.then (items) ->
          expect(items).toEqual []
          done()

    describe '.load', ->
      it 'requests static sources', (done) ->
        provider.addStaticSource (Promise.resolve 'Foo'), CommentProvider.SOURCE_TEXT
        provider.addParser phonyParser, CommentProvider.SOURCE_TEXT
        spy = sinon.spy phonyParser, 'parseMany'
        provider.load().then () -> 
            expect(spy).toHaveBeenCalledWith 'Foo'
            done()

      it 'fails if provider is shut down', ->
        provider = new CommentProvider()
        provider.destroy()
        expect( => provider.load()).toThrow()

      it 'fails if no sources are available', (done) ->
        provider.addStaticSource (Promise.reject 'Error'), CommentProvider.SOURCE_TEXT
        provider.load().catch (e) ->
          expect(e).toBe 'Error'
          done()

    describe '.start', ->
      dynamicSource = null
      spy = null

      beforeEach ->
        dynamicSource = 
          addEventListener: () ->
        spy = sinon.spy dynamicSource, "addEventListener"

      it 'fails if called on destroyed object', ->
        p = new CommentProvider()
        p.destroy()
        expect( => p.start()).toThrow()

      it 'calls load', ->
        loadspy = sinon.spy provider, 'load'
        provider.start()
        expect(loadspy).toHaveBeenCalled true

      it 'binds dynamic sources', (done) ->
        provider.addDynamicSource dynamicSource, CommentProvider.SOURCE_XML
        provider.start().then () ->
          expect(spy).toHaveBeenCalled true
          done()

      it 'does not bind dynamic if the static sources fail', (done) ->
        provider.addDynamicSource dynamicSource, CommentProvider.SOURCE_XML
        provider.addStaticSource (Promise.reject 'Error'), CommentProvider.SOURCE_XML
        provider.start().catch () ->
          expect(spy.callCount).toBe 0
          done()

    describe '.destory', ->
      it 'sets destroyed flag', ->
        provider.destroy()
        expect(provider._destroyed).toBe true

      it 'destroy can be called multiple times', ->
        provider.destroy()
        provider.destroy()
        expect(provider._destroyed).toBe true
