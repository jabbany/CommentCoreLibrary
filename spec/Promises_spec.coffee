'use strict'
describe 'Promises', ->
  describe 'any', ->
    it 'resolves single object', (done) ->
      p = Promises.any 'Foo'
      p.then (value) ->
        expect(value).toBe 'Foo'
        done()

    it 'rejects single promise', (done) ->
      p = Promises.any Promise.reject 'Bar'
      p.catch (value) ->
        expect(value).toBe 'Bar'
        done()

    it 'resolves empty', (done) ->
      p = Promises.any []
      p.catch (e) ->
        expect(e).toBeFalsy()
        done()

    it 'falls back', (done) ->
      p = Promises.any [
        Promise.reject 'A'
        Promise.reject 'B'
        Promise.resolve 'C'
      ]
      p.then (value) ->
        expect(value).toBe 'C'
        done()

    it 'resolves on first', (done) ->
      p = Promises.any [
        Promise.reject 'A'
        Promise.resolve 'B'
        Promise.resolve 'C'
      ]
      p.then (value) ->
        expect(value).toBe 'B'
        done()

    it 'rejects if none resolve', (done) ->
      p = Promises.any [
        Promise.reject 'A'
        Promise.reject 'B'
        Promise.reject 'C'
      ]
      p.catch (errors) ->
        expect(errors).toEqual ['A', 'B', 'C']
        done()
