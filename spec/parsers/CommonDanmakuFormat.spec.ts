import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { CommonDanmakuFormat } from 'comment-core-library';

describe('CommonDanmakuFormat', () => {
  it('provides xml parser', () => {
    expect(typeof CommonDanmakuFormat.XMLParser).toBe('function');
  });

  it('provides json parser', () => {
    expect(typeof CommonDanmakuFormat.JSONParser).toBe('function');
  });

  describe('.XMLParser', () => {
    var parser = null;
    var elem = null;

    beforeAll(() => {
      elem = document.createElement('comment');
      elem.setAttribute('mode', '1');
      elem.setAttribute('size', '25');
      elem.setAttribute('color', '255');
      elem.setAttribute('stime', '1100');
      elem.textContent = 'Test';
    });

    beforeEach(() => {
      parser = new CommonDanmakuFormat.XMLParser();
    });

    it('only accepts xml documents', () => {
      expect(parser.parseOne('foo')).toBe(null);
      expect(parser.parseMany('foo')).toBe(null);
    });

    it('can parse one', () => {
      expect(parser.parseOne(elem)).toEqual({
        'stime': 1100,
        'mode': 1,
        'size': 25,
        'color': 255,
        'text': 'Test'
      });
    });

    it('can parse many', () => {
      var container = document.createElement('comments');
      container.appendChild(elem);
      expect(parser.parseMany(container)).toEqual([
        {
          'stime': 1100,
          'mode': 1,
          'size': 25,
          'color': 255,
          'text': 'Test'
        }
      ]);
    });
  });

  describe('.JSONParser', () => {
    var parser = null;
    var dataValid = {
      mode: 1,
      text: 'Foo',
      stime: 0
    };
    var dataNoMode = {
      stime: 1,
      text: 'Foo'
    };
    var dataNoStime = {
      mode: 1,
      text: 'Foo'
    };
    var dataMode8 = {
      mode: 8,
      stime: 0,
      text: 'This should be code'
    };
    var dataNoText = {
      mode: 1,
      stime: 0
    };

    beforeEach(() => {
      parser = new CommonDanmakuFormat.JSONParser();
    });

    it('can parse one', () => {
      expect(parser.parseOne(dataValid)).toBe(dataValid);
    });

    it('rejects no mode', () => {
      expect(parser.parseOne(dataNoMode)).toBe(null);
    });

    it('rejects no stime', () => {
      expect(parser.parseOne(dataNoStime)).toBe(null);
    });

    it('rejects mode 8 no code', () => {
      expect(parser.parseOne(dataMode8)).toBe(null);
    });

    it('rejects no text', () => {
      expect(parser.parseOne(dataNoText)).toBe(null);
    });

    it('can parse many', () => {
      expect(parser.parseMany([dataValid])).toEqual([dataValid]);
    });
  });
});
