import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CommentManager, BilibiliFormat } from 'comment-core-library';

describe('CommentManager', () => {
  var manager = null, stage = null, cmt = null;
  var c1 = null, c2 = null, c3 = null, c4 = null, c5 = null;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('instance API', () => {
    beforeEach(() => {
      c1 = {
        stime: 1,
        mode: 1
      };
      c2 = {
        stime: 2,
        mode: 1,
        date: '2014-07-12T04:35:55.624Z'
      };
      c3 = {
        stime: 2,
        mode: 1,
        date: '2014-07-12T04:35:55.626Z',
        dbid: '53c0bb2b6465625061b40698'
      };
      c4 = {
        stime: 2,
        mode: 1,
        date: '2014-07-12T04:35:55.626Z',
        dbid: '53c0bb2b6465625061b40700'
      };
      c5 = {
        stime: 2,
        mode: 1,
        date: '2014-07-12T04:35:55.626Z',
        dbid: '53c0bb2b6465625061b40700'
      };
      cmt = {
        stime: 124900,
        color: '#fff',
        mode: 1,
        size: 25,
        hash: '53c0bb2b6465625061b40700',
        date: '2014-07-12T04:35:55.624Z',
        position: 13600
      };
      stage = document.createElement('DIV');
      manager = new CommentManager(stage);
      manager.init();
    });

    ('addEventListener clear destroy dispatchEvent finish init ' +
      'insert load onTimerEvent remove removeEventListener rescale seek send ' +
      'setBounds start stop time validate').split(/\s/).forEach((method) => {

      it('has method: \'' + method + '\'', () => {
        expect(typeof manager[method]).toBe('function');
      });
    });

    it('sets the stage', () => {
      expect(manager.stage).toBe(stage);
    });

    describe('.load', () => {
      it('loads specific comment', () => {
        expect(manager.timeline).toEqual([]);
        manager.load([cmt]);
        expect(manager.timeline).toEqual([cmt]);
      });

      it('sorts the comments', () => {
        manager.load([c5, c2, c4, c1, c3]);
        expect(manager.timeline).toEqual([c1, c2, c3, c4, c5]);
      });

      it('smoking test', () => {
        var sampleNormal = '<?xml version="1.0" encoding="UTF-8"?><i>\n' +
          '<d p="15.104999542236,1,25,16777215,1388314569,0,1a87dd40,364586099">关了弹幕瞬间好多了</d>\n' +
          '<d p="34.501998901367,1,25,16777215,1388466323,0,5655b2f2,365355859">I74700MQ无压力</d>\n' +
          '<d p="62.062000274658,1,25,16711680,1388505601,0,d2255ead,365815874">虽然很卡但是撑下来了</d>\n' +
          '<d p="42.189998626709,7,30,65535,1408889055,0,c1cd5522,576943544">[0,0,"1-1",3.8,"醒来时头昏脑大 不知道在谁家",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>\n' +
          '<d p="45.959999084473,7,30,65535,1408889089,0,c1cd5522,576944643">[0,0,"1-1",5.4,"走为上策应该不用负责任吧",0,0,0,0,1000,0,true,"微软雅黑",1,"M67,264L66,264L230,263"]</d>\n' +
          '<d p="187.02600097656,7,50,26367,1409126632,0,c1cd5522,580760706">[0,0,"1-1",5,"(笑)都现在了还装什么装",0,0,0,0,5000,0,true,"微软雅黑",1,"M24,343L25,343L60,340"]</d>\n' +
          '<d p="16.60000038147,8,25,16777215,1353069133,2,241d61da,149343959">var exCanvas=$.createCanvas({lifeTime:2.0,x:0,y:0});</d>\n' +
          '<d p="16.60000038147,8,25,16777215,1353069133,2,241d61da,149343959">if (13 &lt;d) { trace(\'hahajust a test\');}</d>\n' +
          '<d p="16.60000038147,8,25,16777215,1353069133,2,241d61da,149343959">trace(\'&lt;just some html-like&gt;hahajust a test\');</d></i>';
        var doc = (new DOMParser()).parseFromString(sampleNormal, 'application/xml');
        var comments = (new BilibiliFormat.XMLParser()).parseMany(doc);
        manager.load(comments);
        expect(manager.timeline.length).toBe(9);
      });
    });

    describe('.send', () => {
      it('sends to runline', () => {
        expect(manager.runline.length).toBe(0);
        manager.send(cmt);
        expect(manager.runline.length).toBe(1);
      });

      it('passes scripting comments to the scripting engine', () => {
        var engine = { eval: vi.fn() };
        manager.scripting = engine;
        manager.send({ stime: 0, mode: 8, code: 'trace(1);' });
        expect(engine.eval).toHaveBeenCalledWith('trace(1);');
        expect(manager.runline.length).toBe(0);
      });

      it('warns when dropping scripting comments without an engine', () => {
        var spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        manager.send({ stime: 0, mode: 8, code: 'trace(1);' });
        expect(spy).toHaveBeenCalledOnce();
        expect(manager.runline.length).toBe(0);
      });
    });

    describe('.time', () => {
      it('allocates comments to the runline', () => {
        var spy = vi.spyOn(manager, 'send');
        manager.load([c3, c4, c5]);
        manager.time(3);
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith([c3, c4, c5]);
      });

      it('limits based on limiter', () => {
        var spy = vi.spyOn(manager, 'send');
        manager.load([c3, c4, c5]);
        manager.options.limit = 2;
        manager.time(3);
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith([c3, c4]);
      });

      it('seeks if seek threshold is passed', () => {
        manager.load([c1]);
        manager.options.seekTrigger = 100;
        manager.time(0);
        manager.time(200);
        expect(manager.runline.length).toBe(0);
      });
    });

    describe('.start', () => {
      afterEach(() => {
        manager.stop();
      });

      it('starts the timer', () => {
        var spy = vi.spyOn(window, 'setInterval');
        manager.start();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('.stop', () => {
      it('stops the timer', () => {
        var spy = vi.spyOn(window, 'clearInterval');
        manager.stop();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('.isRunning', () => {
      it('reflects start and stop', () => {
        expect(manager.isRunning).toBe(false);
        manager.start();
        expect(manager.isRunning).toBe(true);
        manager.stop();
        expect(manager.isRunning).toBe(false);
      });
    });

    describe('.timer', () => {
      it('uses the given timer to drive comments', () => {
        var tick = null;
        manager.timer = {
          start: vi.fn((callback) => { tick = callback; }),
          stop: vi.fn()
        };
        manager.send(cmt);
        var spy = vi.spyOn(manager.runline[0], 'time');
        manager.start();
        tick(16);
        expect(spy).toHaveBeenCalledWith(16);
        manager.stop();
        expect(manager.timer.stop).toHaveBeenCalled();
      });
    });

    describe('.destroy', () => {
      it('stops and releases comments, timeline and listeners', () => {
        var callback = vi.fn();
        manager.addEventListener('myCustomEvent', callback);
        manager.load([c1, c2]);
        manager.send(cmt);
        manager.start();
        manager.destroy();
        expect(manager.isRunning).toBe(false);
        expect(manager.runline.length).toBe(0);
        expect(manager.timeline.length).toBe(0);
        expect(stage.childNodes.length).toBe(0);
        manager.dispatchEvent('myCustomEvent');
        expect(callback).not.toHaveBeenCalled();
      });

      it('dispatches destroy event', () => {
        var callback = vi.fn();
        manager.addEventListener('destroy', callback);
        manager.destroy();
        expect(callback).toHaveBeenCalledOnce();
      });
    });

    describe('.remove', () => {
      it('removes a comment instance from the timeline', () => {
        manager.load([c3, c4, c5]);
        manager.remove(c4);
        expect(manager.timeline).toEqual([c3, c5]);
        expect(manager.timeline.indexOf(c4)).toBe(-1);
      });

      it('removes comments matching a filter function', () => {
        manager.load([c1, c2, c3]);
        manager.remove((data) => data.stime === 2);
        expect(manager.timeline).toEqual([c1]);
      });

      it('only removes when the filter returns true', () => {
        manager.load([c1, c2]);
        manager.remove(() => 1);
        expect(manager.timeline.length).toBe(2);
      });

      it('keeps the position pointer on the same comment', () => {
        manager.load([c1, c3, c4]);
        manager.position = 2;
        manager.remove(c1);
        expect(manager.timeline[manager.position]).toBe(c4);
      });
    });

    describe('.clear', () => {
      it('clears', () => {
        manager.send(cmt);
        expect(manager.runline.length).toBe(1);
        manager.clear();
        expect(manager.runline.length).toBe(0);
      });
    });

    describe('.insert', () => {
      it('inserts to right position', () => {
        manager.load([c3, c5]);
        expect(manager.timeline).toEqual([c3, c5]);
        manager.insert(c4);
        expect(manager.timeline).toEqual([c3, c4, c5]);
      });
    });

    describe('.setBounds', () => {
      beforeEach(() => {
        manager.stage.style.width = '640px';
        manager.stage.style.width = '480px';
      });

      it('updates width and height', () => {
        manager.setBounds();
        expect(manager.width).toEqual(stage.offsetWidth);
        expect(manager.height).toEqual(stage.offsetHeight);
      });

      it('dispatches resize event', () => {
        var callback = vi.fn();
        manager.addEventListener('resize', callback);
        manager.setBounds();
        expect(callback).toHaveBeenCalled();
      });

      it('sets bounds on comment space allocators', () => {
        var spies = {};
        for (var allocatorName in manager.csa) {
          spies[allocatorName] = vi.spyOn(manager.csa[allocatorName], 'setBounds');
        }
        manager.setBounds();
        for (var name in spies) {
          expect(spies[name]).toHaveBeenCalledWith(stage.offsetWidth, stage.offsetHeight);
        }
      });
    });

    describe('.addEventListener .dispatchEvent', () => {
      it('add one event listener', () => {
        var callback = vi.fn();
        manager.addEventListener('myCustomEvent', callback);
        manager.dispatchEvent('myCustomEvent');
        expect(callback).toHaveBeenCalled();
      });

      it('add multiple event listeners', () => {
        var dispatchedEventId = 0;
        manager.addEventListener('myCustomEvent', () => {
          dispatchedEventId = 1;
        });
        manager.addEventListener('myCustomEvent', () => {
          dispatchedEventId = 2;
        });
        manager.dispatchEvent('myCustomEvent');
        expect(dispatchedEventId).toBe(2);
      });

      it('dispatch event works with data', () => {
        var callback = vi.fn();
        manager.addEventListener('myCustomEvent', callback);
        manager.dispatchEvent('myCustomEvent', 'foo');
        expect(callback).toHaveBeenCalledWith('foo');
      });

      it('removes event listeners', () => {
        var callback = vi.fn();
        manager.addEventListener('myCustomEvent', callback);
        manager.removeEventListener('myCustomEvent', callback);
        manager.dispatchEvent('myCustomEvent');
        expect(callback).not.toHaveBeenCalled();
      });

      it('ignores removing unknown listeners', () => {
        expect(() => manager.removeEventListener('unknownEvent', () => {}))
          .not.toThrow();
      });

      it('lets listeners remove themselves while dispatching', () => {
        var second = vi.fn();
        var first = () => {
          manager.removeEventListener('myCustomEvent', first);
        };
        manager.addEventListener('myCustomEvent', first);
        manager.addEventListener('myCustomEvent', second);
        manager.dispatchEvent('myCustomEvent');
        expect(second).toHaveBeenCalledOnce();
      });
    });
  });
});
