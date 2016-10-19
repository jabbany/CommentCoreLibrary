'use strict'

describe 'CommentProvider', ->
  beforeEach ->
    # TODO: remove promises api polyfill when phantomjs supports it
    window.Promise = (f) ->
      # Don't actually call f
    window.Promise.prototype.then = (f) -> this
    window.Promise.prototype.catch = (f) -> this
    window.Promise.resolve = (f) -> new Promise()

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
        provider.addStaticSource(promise, CommentProvider.SOURCE_XML)
        expect(provider._staticSources[CommentProvider.SOURCE_XML][0]).toBe promise

      it 'rejects if provider is shut down', ->
        provider = new CommentProvider()
        provider.destroy()
        expect( => provider.addStaticSource({}, CommentProvider.SOURCE_XML)).toThrow()

    describe '.addDynamicSource', ->

    
      
