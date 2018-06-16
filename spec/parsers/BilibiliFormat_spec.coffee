'use strict'
describe 'BilibiliFormat', ->
  sampleNormal = """
  <?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.tv</chatserver><chatid>207527</chatid><mission>0</mission><source>k-v</source><d p="15.104999542236,1,25,16777215,1388314569,0,1a87dd40,364586099">关了弹幕瞬间好多了</d>
  <d p="34.501998901367,1,25,16777215,1388466323,0,5655b2f2,365355859">I74700MQ无压力</d>
  <d p="62.062000274658,1,25,16711680,1388505601,0,d2255ead,365815874">虽然很卡但是撑下来了</d>
  <d p="23.566999435425,1,25,16777215,1388553625,0,357931b1,366049252">华为有些小卡</d>
  <d p="0.55500000715256,5,25,6737151,1388553840,0,357931b1,366052476">提示：手机客户端请将同屏弹幕密度调至“无限制弹幕”</d>
  <d p="0,1,25,16777215,1388563426,0,c9d27259,366200519">关了弹幕一切良好，麻麻再也不用担心我的电脑卡了</d>
  <d p="0,1,25,16777215,1388563494,0,c9d27259,366201675">黑历史，哈哈哈</d>
  <d p="44.536998748779,1,25,16777215,1388579707,0,e9174629,366375632">ipad表示一点儿都不卡</d>
  <d p="4.4749999046326,1,25,16777215,1388705751,0,8ad22bbe,367046945">清弹幕了。wrop 你好</d>
  <d p="1.3780000209808,1,25,16777215,1388833547,0,626e9589,367850149">卡爆了……</d></i>
  """

  sampleAdvanced ="""
  <?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>2196678</chatid><mission>0</mission><source>k-v</source><d p="8.2299995422363,7,25,16751001,1408888765,0,c1cd5522,576934780">[0,0,"1-1",3.8,"《霸道总裁爱上我》(SMAP-[SHAKE])",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="12.039999961853,7,25,16751001,1408888786,0,c1cd5522,576935381">[0,0,"1-1",3.7,"演唱/填词/念白/后期/压制：翘课、少恭",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="15.770000457764,7,25,16751001,1408888807,0,c1cd5522,576936074">[0,0,"1-1",3.8,"字幕：择日",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="23.270000457764,7,25,65535,1408888851,0,c1cd5522,576937468">[0,0,"1-1",3.7,"难得周末的休假 工作谁要管它",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="27.040000915527,7,25,65535,1408888876,0,c1cd5522,576938275">[0,0,"1-1",4,"就算是霸道总裁 我也不接电话",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="30.989999771118,7,25,65535,1408888894,0,c1cd5522,576938800">[0,0,"1-1",5,"一觉睡到大中午 谁也不用怕",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="38.479999542236,7,30,65535,1408889037,0,c1cd5522,576942976">[0,0,"1-1",3.7,"昨晚明明在酒吧 不小心喝到挂",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="42.189998626709,7,30,65535,1408889055,0,c1cd5522,576943544">[0,0,"1-1",3.8,"醒来时头昏脑大 不知道在谁家",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="45.959999084473,7,30,65535,1408889089,0,c1cd5522,576944643">[0,0,"1-1",5.4,"走为上策应该不用负责任吧",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>
  <d p="187.02600097656,7,50,26367,1409126632,0,c1cd5522,580760706">[0,0,"1-1",5,"(笑)都现在了还装什么装",0,0,0,0,5000,0,true,"微软雅黑",1,"M24,343L25,343L25,342L26,342L27,342L29,340L30,340L31,339L32,339L33,339L34,338L35,338L36,338L37,338L38,338L39,338L40,338L42,338L43,338L44,338L45,338L46,338L47,338L48,338L49,338L51,338L52,338L53,338L54,338L55,338L56,338L57,338L59,340L60,340"]</d></i>
  """

  sampleScripting ="""
  <?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.tv</chatserver><chatid>603941</chatid><mission>0</mission><source>k-v</source><d p="0.40000000596046,7,36,16777215,1352881267,1,241d61da,147777736">[63,113,"1-0.5",5.1,"Please",0,0,63,113,0.5,0,true,"黑体",1]</d>
  <d p="1.8999999761581,7,36,16777215,1352881321,1,241d61da,147777864">[138,162,"1-0.5",3.6,"recollect     ",0,0,138,162,0.5,0,true,"黑体",1]</d>
  <d p="3.7999999523163,7,36,16777215,1352881356,1,241d61da,147777951">[138,162,"1-0.5",1.7,"          your",0,0,138,162,0.5,0,true,"黑体",1]</d>
  <d p="16.60000038147,8,25,16777215,1353069133,2,241d61da,149343959">var exCanvas=$.createCanvas({lifeTime:2.0,x:0,y:0});
  var exShape=$.createShape({lifeTime:2.0,x:0,y:0,parent:exCanvas});
  exShape.graphics.lineStyle(2,16763904,1,false,"normal",null,null);
  exShape.graphics.beginFill(0,0);
  if (j < 5) {}
  exShape.graphics.moveTo(96,95);
  exShape.graphics.curveTo(56,315,58,309);
  exShape.graphics.curveTo(77,288,90,286);
  exShape.graphics.endFill();</d></i>
  """

  sampleMalformed = """
  <?xml version="1.0" encoding="UTF-8"?><i>
  <d p="34.501998901367,1,25,16777215,1388466323,0,5655b2f2,365355859">I74700MQ无压力
  <d p="34.501998901367,1,25,16777215,1388466323,0,5655b2f2,365355859">I74700MQ无压力</d>
  <d p="34.501998901367,1,25,16777215,1388466323,0,5655b2f2,365355859">I74700MQ无压力</d>
  """

  it 'provides xml parser', ->
    expect(typeof BilibiliFormat.XMLParser).toBe 'function'

  it 'provides text parser', ->
    expect(typeof BilibiliFormat.TextParser).toBe 'function'

  describe '.XMLParser', ->
    parser = null
    document = null

    beforeAll ->
      document = (new DOMParser()).parseFromString sampleNormal, "application/xml"
    beforeEach ->
      parser = new BilibiliFormat.XMLParser()

    it 'has sane defaults', ->
      expect(parser._attemptFix).toBe true
      expect(parser._logBadComments).toBe true

    it 'can be configured', ->
      parser = new BilibiliFormat.XMLParser 
        attemptFix: false
        logBadComments: false
      expect(parser._attemptFix).toBe false
      expect(parser._logBadComments).toBe false

    it 'only accepts xml documents', ->
      expect(parser.parseOne "foo").toBe null
      expect(parser.parseMany "foo").toBe null

    it 'can parse one', ->
      expect(parser.parseOne document.getElementsByTagName('d')[0]).toEqual
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

    it 'can parse many', ->
      comments = parser.parseMany document
      expect(comments.length).toBe 10
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

    it 'can parse scripting', ->
      comments = parser.parseMany (new DOMParser()).parseFromString sampleScripting, 'application/xml'
      expect(comments.length).toBe 4
      expect(comments[0].mode).toEqual 7
      expect(comments[3].mode).toEqual 8

    it 'can parse advanced', ->
      comments = parser.parseMany (new DOMParser()).parseFromString sampleAdvanced, 'application/xml'
      expect(comments.length).toBe 10
      expect(comments[0].mode).toEqual 7
      expect(comments[0].motion).not.toBe null

  describe '.TextParser', ->
    parser = null
    xmltext = null

    beforeAll ->
      xmltext = readFixtures 'av207527.xml'
    beforeEach ->
      parser = new BilibiliFormat.TextParser()

    it 'has sane defaults', ->
      expect(parser._allowInsecureDomParsing).toBe true
      expect(parser._attemptEscaping).toBe true

    it 'can be configured', ->
      parser = new BilibiliFormat.TextParser
        allowInsecureDomParsing: false
        attemptEscaping: false
      expect(parser._allowInsecureDomParsing).toBe false
      expect(parser._attemptEscaping).toBe false

    it 'propagates parameters', ->
      parser = new BilibiliFormat.TextParser
        attemptFix: false
        logBadComments: false
        allowInsecureDomParsing: true
      expect(parser._xmlParser instanceof BilibiliFormat.XMLParser).toBe true
      expect(parser._xmlParser._attemptFix).toBe false
      expect(parser._xmlParser._logBadComments).toBe false

    it 'can parse many (insecure dom parsing)', ->
      comments = parser.parseMany sampleScripting
      expect(comments.length).toBe 4
      expect(comments[3].mode).toBe 8

    it 'can handle malformed case', ->
      comments = parser.parseMany sampleMalformed
      expect(comments.length).toBe 3
