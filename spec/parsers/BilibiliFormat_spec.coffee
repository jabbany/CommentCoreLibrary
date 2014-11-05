'use strict'
describe 'BilibiliFormat', ->
  jasmine.getFixtures().fixturesPath = "test/"
  it 'parses normal comments', ->
    # TODO: Update testing to pass in an XML object instead of 
    # relying on the unsafe innerHTML. 
    xml_text = readFixtures 'av207527.xml'
    comments = BilibiliParser(null, xml_text)
    expect(comments.length).toBe 12546
    expect(comments[0]).toEqual
      stime:    15105
      size:     25
      color:    16777215
      mode:     1
      date:     1388314569
      pool:     0
      position: 'absolute'
      dbid:     364586099
      hash:     '1a87dd40'
      border:   false
      text:     '关了弹幕瞬间好多了'

  it 'parses scripting comments', ->
    xml_text = readFixtures 'scripting/tsubasa.xml'
    comments = BilibiliParser(null, xml_text)
    expect(comments.length).toBe 654
    expect(comments[0].mode).toEqual 7
    expect(comments[653].mode).toEqual 8
  
  it 'parses advanced comments', ->
    xml_text = readFixtures 'boss.xml'
    comments = BilibiliParser(null, xml_text)
    expect(comments.length).toBe 1000
    expect(comments[0].mode).toEqual 7
    expect(comments[0].motion).not.toBe null
