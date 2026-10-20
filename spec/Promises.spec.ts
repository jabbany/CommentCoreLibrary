import { describe, it, expect } from 'vitest';
import { Promises } from 'comment-core-library';

describe('Promises', () => {
  describe('any', () => {
    it('resolves single object', async () => {
      await expect(Promises.any('Foo')).resolves.toBe('Foo');
    });

    it('rejects single promise', async () => {
      await expect(Promises.any(Promise.reject('Bar'))).rejects.toBe('Bar');
    });

    it('resolves empty', async () => {
      await expect(Promises.any([])).rejects.toBeFalsy();
    });

    it('falls back', async () => {
      var p = Promises.any([
        Promise.reject('A'),
        Promise.reject('B'),
        Promise.resolve('C')
      ]);
      await expect(p).resolves.toBe('C');
    });

    it('resolves on first', async () => {
      var p = Promises.any([
        Promise.reject('A'),
        Promise.resolve('B'),
        Promise.resolve('C')
      ]);
      await expect(p).resolves.toBe('B');
    });

    it('rejects if none resolve', async () => {
      var p = Promises.any([
        Promise.reject('A'),
        Promise.reject('B'),
        Promise.reject('C')
      ]);
      await expect(p).rejects.toEqual(['A', 'B', 'C']);
    });
  });
});
