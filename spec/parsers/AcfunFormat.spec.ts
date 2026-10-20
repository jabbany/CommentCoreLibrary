import { describe, it, expect, beforeEach } from 'vitest';
import { AcfunFormat } from 'comment-core-library';

describe('AcfunFormat', () => {
  var textfix = (text) => text.replace(/\ /g, ' ');
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
  });
});
