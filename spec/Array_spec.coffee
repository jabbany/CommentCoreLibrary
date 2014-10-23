'use strict'
describe 'BinArray', ->
  testAray = null
  compare = (a, b)-> a - b

  describe 'bsearch', ->
    describe 'with empty array', ->
      beforeEach -> testAray = []
      it 'always returns 0', ->
        expect(BinArray.bsearch(testAray, 2, compare)).toBe 0
        expect(BinArray.bsearch(testAray, 0, compare)).toBe 0

    describe 'with [1, 3, 5]', ->
      beforeEach -> testAray = [1,3,5]

      it 'search for 0', ->
        expect(BinArray.bsearch(testAray, 0, compare)).toBe 0

      it 'search for 1', ->
        expect(BinArray.bsearch(testAray, 1, compare)).toBe 1

      it 'search for 2', ->
        expect(BinArray.bsearch(testAray, 2, compare)).toBe 1

      it 'search for 3', ->
        expect(BinArray.bsearch(testAray, 3, compare)).toBe 2

      it 'search for 4', ->
        expect(BinArray.bsearch(testAray, 4, compare)).toBe 2

      it 'search for 5', ->
        expect(BinArray.bsearch(testAray, 5, compare)).toBe 3

      it 'search for 6', ->
        expect(BinArray.bsearch(testAray, 6, compare)).toBe 3

  describe 'binsert', ->
    describe 'with empty array', ->
      beforeEach -> testAray = []
      it 'just insert to array', ->
        expect(BinArray.binsert(testAray, 0, compare)).toBe 0
        expect(testAray).toEqual [0]

    describe 'with [1, 3, 5]', ->
      beforeEach -> testAray = [1,3,5]
      it 'insert 0', ->
        expect(BinArray.binsert(testAray, 0, compare)).toBe 0
        expect(testAray).toEqual [0,1,3,5]
      it 'insert 1', ->
        expect(BinArray.binsert(testAray, 1, compare)).toBe 1
        expect(testAray).toEqual [1,1,3,5]
      it 'insert 2', ->
        expect(BinArray.binsert(testAray, 2, compare)).toBe 1
        expect(testAray).toEqual [1,2,3,5]
      it 'insert 3', ->
        expect(BinArray.binsert(testAray, 3, compare)).toBe 2
        expect(testAray).toEqual [1,3,3,5]
      it 'insert 4', ->
        expect(BinArray.binsert(testAray, 4, compare)).toBe 2
        expect(testAray).toEqual [1,3,4,5]
      it 'insert 5', ->
        expect(BinArray.binsert(testAray, 5, compare)).toBe 3
        expect(testAray).toEqual [1,3,5,5]
      it 'insert 6', ->
        expect(BinArray.binsert(testAray, 6, compare)).toBe 3
        expect(testAray).toEqual [1,3,5,6]
