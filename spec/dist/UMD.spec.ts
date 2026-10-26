import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

var require = createRequire(import.meta.url);
var dist = (file) => require.resolve('../../dist/' + file);

var EXPORTS = [
  'BinArray', 'CommentManager', 'CoreComment', 'ScrollComment',
  'CssScrollComment', 'CommentFactory', 'CommentSpaceAllocator',
  'AnchorCommentSpaceAllocator', 'IntervalTimer', 'AnimationFrameTimer',
  'CommentUtils', 'CommentFilter',
  'CommentProvider', 'Promises', 'BilibiliFormat', 'AcfunFormat',
  'CommonDanmakuFormat'
];

var expectApi = (lib) => {
  EXPORTS.forEach((name) => {
    expect(lib[name], name).toBeDefined();
  });
  expect(typeof lib.CommentManager).toBe('function');
  expect(typeof lib.CommentUtils.Matrix3D).toBe('function');
  expect(typeof lib.BilibiliFormat.XMLParser).toBe('function');
};

['CommentCoreLibrary.js', 'CommentCoreLibrary.min.js'].forEach((file) => {
  describe(file, () => {
    var source = null;
    var getSource = () => {
      if (source === null) {
        source = readFileSync(dist(file), 'utf8');
      }
      return source;
    };

    it('exports the API to CommonJS', () => {
      expectApi(require(dist(file)));
    });

    it('defines an AMD module', () => {
      var calls = [];
      var define:any = (deps, factory) => {
        calls.push({ deps: deps, factory: factory });
      };
      define.amd = {};
      var context = vm.createContext({ define: define });
      vm.runInContext(getSource(), context);

      expect(calls.length).toBe(1);
      expect(calls[0].deps).toEqual(['exports']);
      var exports = {};
      calls[0].factory(exports);
      expectApi(exports);
      // Globals are not leaked when loaded as a module
      expect(context.CommentCoreLibrary).toBeUndefined();
      expect(context.CommentManager).toBeUndefined();
    });

    it('exposes globals when loaded as a plain script', () => {
      var context = vm.createContext({});
      vm.runInContext(getSource(), context);

      expectApi(context.CommentCoreLibrary);
      EXPORTS.forEach((name) => {
        expect(context[name], name).toBe(context.CommentCoreLibrary[name]);
      });
    });
  });
});

describe('CommentCoreLibrary.mjs', () => {
  it('exports the API as an ES module', async () => {
    var lib = await import(pathToFileURL(dist('CommentCoreLibrary.mjs')).href);
    expectApi(lib);
  });
});
