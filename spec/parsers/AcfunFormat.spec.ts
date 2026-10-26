import { describe, it, expect, beforeEach } from 'vitest';
import { AcfunFormat } from 'comment-core-library';

describe('AcfunFormat', () => {
  var textfix = (text) => text.replace(/\ /g, '\u00a0');
  it('provides json parser', () => {
    expect(typeof AcfunFormat.JSONParser).toBe('function');
  });

  describe('.JSONParser', () => {
    var raw = JSON.stringify([
      {
        'c': '1,16763904,5,25,guest,1315736602.0',
        'm': 'This is just some test.'
      },
      {
        'c': '1,16777215,1,25,guest,1315736602.0',
        'm': 'Comment 2.'
      }
    ]);
    var parser = null, data = null;

    beforeEach(() => {
      parser = new AcfunFormat.JSONParser();
      data = JSON.parse(raw);
    });

    it('can parse one', () => {
      expect(parser.parseOne(data[0])).toEqual({
        stime: 1000,
        color: 16763904,
        mode: 5,
        size: 25,
        hash: 'guest',
        date: 1315736602.0,
        position: 'absolute',
        text: textfix('This is just some test.')
      });
    });

    it('can parse list', () => {
      var comments = parser.parseMany(data);
      expect(comments.length).toBe(2);
      expect(comments[0]).toEqual({
        stime: 1000,
        color: 16763904,
        mode: 5,
        size: 25,
        hash: 'guest',
        date: 1315736602.0,
        position: 'absolute',
        text: textfix('This is just some test.')
      });
    });

    describe('advanced comments', () => {
      var advanced = (params) => ({
        'c': '1,16777215,7,25,guest,1315736602.0',
        'm': JSON.stringify(params)
      });

      it('parses position, duration and motion', () => {
        var comment = parser.parseOne(advanced({
          n: 'Advanced',
          p: { x: 500, y: 250 },
          l: 3,
          z: [{ l: 1, x: 1000, t: 0.5 }]
        }));
        expect(comment.position).toBe('relative');
        expect(comment.text).toBe('Advanced');
        expect(comment.x).toBe(0.5);
        expect(comment.y).toBe(0.25);
        expect(comment.dur).toBe(1000);
        expect(comment.motion).toEqual([{
          x: { from: 0.5, to: 1, dur: 1000, delay: 0 },
          alpha: { from: 1, to: 0.5, dur: 1000, delay: 0 }
        }]);
      });

      it('clamps alpha values', () => {
        var comment = parser.parseOne(advanced({
          n: 'Alpha',
          a: 2,
          z: [{ l: 1, t: -1 }]
        }));
        expect(comment.opacity).toBe(1);
        expect(comment.motion[0].alpha.to).toBe(0);
      });

      it('drops comments with invalid advanced parameters', () => {
        var quiet = new AcfunFormat.JSONParser({ logBadComments: false });
        expect(quiet.parseOne({
          'c': '1,16777215,7,25,guest,1315736602.0',
          'm': '{not json'
        })).toBe(null);
      });
    });
  });
});
