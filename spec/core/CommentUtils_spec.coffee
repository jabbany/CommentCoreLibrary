'use strict'
describe 'CommentUtils', ->
  describe 'Matrix3D', ->
    describe 'identity', ->
      it 'returns identity matrix', ->
        expect(CommentUtils.Matrix3D.identity().isIdentity()).toBe true

    describe 'createScaleMatrix', ->
      it 'returns identity matrix', ->
        expect(CommentUtils.Matrix3D.createScaleMatrix(1, 1, 1).isIdentity()).toBe true
      
      it 'returns proper scale matrix', ->
        expect(CommentUtils.Matrix3D.createScaleMatrix(1, 2, 3).flatArray).toEqual [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1]

    describe 'createRotationMatrix', ->
      it 'returns identity matrix if no rotation', ->
        expect(CommentUtils.Matrix3D.createRotationMatrix(0, 0, 0).isIdentity()).toBe true

      it 'returns identity matrix if rotating 360 degrees', ->
        expect(CommentUtils.Matrix3D.createRotationMatrix(360, 0, 0).isIdentity()).toBe true
        expect(CommentUtils.Matrix3D.createRotationMatrix(0, 360, 0).isIdentity()).toBe true
        expect(CommentUtils.Matrix3D.createRotationMatrix(0, 0, 360).isIdentity()).toBe true

    describe 'constructor', -> 
      it 'throws error if constructed improper dimensions', ->
        expect( => new CommentUtils.Matrix3D([1, 2, 3])).toThrow()

    describe 'instance API', ->
      m = null
      n = null
      mdotn = null
      beforeEach ->
        m = new CommentUtils.Matrix3D [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6]
        n = CommentUtils.Matrix3D.createScaleMatrix 6, 7, 8
        mdotn = new CommentUtils.Matrix3D [6, 14, 24, 4, 30, 42, 56, 8, 54, 0, 8, 2, 18, 28, 40, 6]

      it 'gets flatArray', ->
        expect(m.flatArray).toEqual [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6]

      it 'cannot set flatArray', ->
        expect( => m.flatArray = []).toThrow()

      it 'checks identity', ->
        expect(m.isIdentity()).toBe false

      it 'dot product', ->
        expect(m.dot(n).equals mdotn).toBe true

      it 'toCss', ->
        expect(n.toCss()).toBe 'matrix3d(6,0,0,0,0,7,0,0,0,0,8,0,0,0,0,1)'
