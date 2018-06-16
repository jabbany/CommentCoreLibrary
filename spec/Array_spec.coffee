'use strict'
describe 'BinArray', ->
  testArray = null
  compare = (a, b) -> a - b

  describe 'bsearch', ->
    describe 'error cases', ->
      it 'throws when input is not array', ->
        #expect( => BinArray.bsearch({}, 1, compare)).toThrow()

      it 'throws when comparator is inconsistent/pathologic (infinite loop)', ->
        testArray = [1, 3, 5]
        hasComparedLess = false
        badComparator = (a, b) ->
          if a < b
            if !hasComparedLess
              hasComparedLess = true
              return -1
            else
              return 1
          else
            return 1
        #expect( => BinArray.bsearch(testArray, 2, badComparator)).toThrow()

      it 'throws when comparator is inconsistent (impossible case)', ->
        testArray = [1, 3, 5]
        compareSequence = [1, -1, -1, 1, -1]
        badComparator = (a, b) -> compareSequence.shift()
        #expect( => BinArray.bsearch(testArray, 2, badComparator)).toThrow()

    describe 'with empty array', ->
      beforeEach -> testArray = []
      it 'always returns 0', ->
        expect(BinArray.bsearch(testArray, 2, compare)).toBe 0
        expect(BinArray.bsearch(testArray, 0, compare)).toBe 0

    describe 'with [1, 3, 5]', ->
      beforeEach -> testArray = [1, 3, 5]

      it 'search for 0', ->
        expect(BinArray.bsearch(testArray, 0, compare)).toBe 0

      it 'search for 1', ->
        expect(BinArray.bsearch(testArray, 1, compare)).toBe 1

      it 'search for 2', ->
        expect(BinArray.bsearch(testArray, 2, compare)).toBe 1

      it 'search for 3', ->
        expect(BinArray.bsearch(testArray, 3, compare)).toBe 2

      it 'search for 4', ->
        expect(BinArray.bsearch(testArray, 4, compare)).toBe 2

      it 'search for 5', ->
        expect(BinArray.bsearch(testArray, 5, compare)).toBe 3

      it 'search for 6', ->
        expect(BinArray.bsearch(testArray, 6, compare)).toBe 3

  describe 'binsert', ->
    describe 'with empty array', ->
      beforeEach -> testArray = []
      it 'just insert to array', ->
        expect(BinArray.binsert(testArray, 0, compare)).toBe 0
        expect(testArray).toEqual [0]

    describe 'with [1, 3, 5]', ->
      beforeEach -> testArray = [1,3,5]
      it 'insert 0', ->
        expect(BinArray.binsert(testArray, 0, compare)).toBe 0
        expect(testArray).toEqual [0,1,3,5]
      it 'insert 1', ->
        expect(BinArray.binsert(testArray, 1, compare)).toBe 1
        expect(testArray).toEqual [1,1,3,5]
      it 'insert 2', ->
        expect(BinArray.binsert(testArray, 2, compare)).toBe 1
        expect(testArray).toEqual [1,2,3,5]
      it 'insert 3', ->
        expect(BinArray.binsert(testArray, 3, compare)).toBe 2
        expect(testArray).toEqual [1,3,3,5]
      it 'insert 4', ->
        expect(BinArray.binsert(testArray, 4, compare)).toBe 2
        expect(testArray).toEqual [1,3,4,5]
      it 'insert 5', ->
        expect(BinArray.binsert(testArray, 5, compare)).toBe 3
        expect(testArray).toEqual [1,3,5,5]
      it 'insert 6', ->
        expect(BinArray.binsert(testArray, 6, compare)).toBe 3
        expect(testArray).toEqual [1,3,5,6]
