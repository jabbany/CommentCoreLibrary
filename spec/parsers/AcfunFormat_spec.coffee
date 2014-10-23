'use strict'
describe 'AcfunFormat', ->
  jasmine.getFixtures().fixturesPath = "test/"
  it 'works', ->
    json = readFixtures 'ACFun.json'
    comments = AcfunParser(json)
    expect(comments.length).toBe 155
    expect(comments[0]).toEqual
      stime:    98200
      color:    16777215
      mode:     1
      size:     25
      hash:     'guest'
      date:     1315564729
      position: 'absolute'
      text:     '我谢了你的爱'
