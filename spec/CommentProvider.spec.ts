import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { CommentProvider, CommentManager } from 'comment-core-library';
import { FakeXMLHttpRequest } from './support/FakeXMLHttpRequest';

describe('CommentProvider', () => {
  var phonyParser = null;
  beforeAll(() => {
    vi.stubGlobal('XMLHttpRequest', FakeXMLHttpRequest);
    phonyParser = {
      parseOne: (item) => item,
      parseMany: (items) => items
    };
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has constants', () => {
    expect(CommentProvider.SOURCE_XML).toBe('XML');
    expect(CommentProvider.SOURCE_JSON).toBe('JSON');
    expect(CommentProvider.SOURCE_TEXT).toBe('TEXT');
  });

  describe('.BaseHTTPProvider', () => {
    it('produces a promise', () => {
      var provider = CommentProvider.BaseHttpProvider('GET', '.', 'text');
      expect(provider instanceof Promise).toBe(true);
    });
  });

  describe('.JSONProvider', () => {
    it('produces a promise', () => {
      var provider = CommentProvider.JSONProvider('GET', '.');
      expect(provider instanceof Promise).toBe(true);
    });

    it('dispatches to .BaseHTTPProvider', () => {
      var spy = vi.spyOn(CommentProvider, 'BaseHttpProvider');
      CommentProvider.JSONProvider('GET', '.', {}, '');
      expect(spy).toHaveBeenCalledWith('GET', '.', 'json', {}, '');
    });
  });

  describe('.XMLProvider', () => {
    it('produces a promise', () => {
      var provider = CommentProvider.XMLProvider('GET', '.');
      expect(provider instanceof Promise).toBe(true);
    });

    it('dispatches to .BaseHTTPProvider', () => {
      var spy = vi.spyOn(CommentProvider, 'BaseHttpProvider');
      CommentProvider.XMLProvider('GET', '.', {}, '');
      expect(spy).toHaveBeenCalledWith('GET', '.', 'document', {}, '');
    });
  });

  describe('.TextProvider', () => {
    it('produces a promise', () => {
      var provider = CommentProvider.TextProvider('GET', '.');
      expect(provider instanceof Promise).toBe(true);
    });

    it('dispatches to .BaseHTTPProvider', () => {
      var spy = vi.spyOn(CommentProvider, 'BaseHttpProvider');
      CommentProvider.TextProvider('GET', '.', {}, '');
      expect(spy).toHaveBeenCalledWith('GET', '.', 'text', {}, '');
    });
  });

  describe('instance CommentProvider', () => {
    var provider = null;

    beforeEach(() => {
      provider = new CommentProvider();
    });

    describe('.addStaticSource', () => {
      it('accepts static source', () => {
        var promise = {};
        provider.addStaticSource(promise, CommentProvider.SOURCE_XML);
        expect(provider._staticSources[CommentProvider.SOURCE_XML][0]).toBe(promise);
      });

      it('rejects if provider is shut down', () => {
        provider = new CommentProvider();
        provider.destroy();
        expect(() => provider.addStaticSource({}, CommentProvider.SOURCE_XML)).toThrow();
      });
    });

    describe('.addDynamicSource', () => {
      it('accepts dynamic source', () => {
        var dynamicSource = {
          addEventListner: vi.fn()
        };
        provider.addDynamicSource(dynamicSource, CommentProvider.SOURCE_XML);
        expect(provider._dynamicSources[CommentProvider.SOURCE_XML][0]).toBe(dynamicSource);
      });

      it('rejects if provider is shut down', () => {
        provider = new CommentProvider();
        provider.destroy();
        expect(() => provider.addDynamicSource({}, CommentProvider.SOURCE_XML)).toThrow();
      });
    });

    describe('.addParser', () => {
      it('accepts parser', () => {
        var parser = {};
        provider.addParser(parser, CommentProvider.SOURCE_JSON);
        expect(provider._parsers[CommentProvider.SOURCE_JSON][0]).toBe(parser);
      });

      it('rejects if provider is shut down', () => {
        provider = new CommentProvider();
        provider.destroy();
        expect(() => provider.addParser({}, CommentProvider.SOURCE_XML)).toThrow();
      });
    });

    describe('.addTarget', () => {
      var commentManager = null;
      beforeAll(() => {
        commentManager = new CommentManager(document.createElement('div'));
      });

      it('accepts target', () => {
        provider.addTarget(commentManager, CommentProvider.SOURCE_JSON);
        expect(provider._targets.length).toBe(1);
        expect(provider._targets[0]).toBe(commentManager);
      });

      it('rejects if target is not CommentManager', () => {
        expect(() => provider.addTarget({})).toThrow();
      });

      it('rejects if provider is shut down', () => {
        provider = new CommentProvider();
        provider.destroy();
        expect(() => provider.addTarget(commentManager)).toThrow();
      });
    });

    describe('.applyParsersOne', () => {
      var rejectingParser = {
        parseOne: () => null,
        parseMany: () => null
      };
      var resolvingParser = {
        parseOne: (t) => t,
        parseMany: (t) => t
      };

      it('rejects if no parsers for type', async () => {
        var promise = provider.applyParsersOne({}, CommentProvider.SOURCE_JSON);
        await expect(promise).rejects.toBeInstanceOf(Error);
      });

      it('rejects if no parser accepts', async () => {
        provider.addParser(rejectingParser, CommentProvider.SOURCE_JSON);
        var promise = provider.applyParsersOne({}, CommentProvider.SOURCE_JSON);
        await expect(promise).rejects.toBeInstanceOf(Error);
      });

      it('accepts if parser accepts', async () => {
        provider.addParser(resolvingParser, CommentProvider.SOURCE_JSON);
        var promise = provider.applyParsersOne({}, CommentProvider.SOURCE_JSON);
        await expect(promise).resolves.toEqual({});
      });
    });

    describe('.applyParsersList', () => {
      var rejectingParser = {
        parseOne: () => null,
        parseMany: () => null
      };
      var resolvingParser = {
        parseOne: (t) => t,
        parseMany: (t) => t
      };

      it('rejects if no parsers for type', async () => {
        var promise = provider.applyParsersList([], CommentProvider.SOURCE_JSON);
        await expect(promise).rejects.toBeInstanceOf(Error);
      });

      it('rejects if no parser accepts', async () => {
        provider.addParser(rejectingParser, CommentProvider.SOURCE_JSON);
        var promise = provider.applyParsersList([], CommentProvider.SOURCE_JSON);
        await expect(promise).rejects.toBeInstanceOf(Error);
      });

      it('accepts if parser accepts', async () => {
        provider.addParser(resolvingParser, CommentProvider.SOURCE_JSON);
        var promise = provider.applyParsersList([], CommentProvider.SOURCE_JSON);
        await expect(promise).resolves.toEqual([]);
      });
    });

    describe('.load', () => {
      it('requests static sources', async () => {
        provider.addStaticSource(Promise.resolve('Foo'), CommentProvider.SOURCE_TEXT);
        provider.addParser(phonyParser, CommentProvider.SOURCE_TEXT);
        var spy = vi.spyOn(phonyParser, 'parseMany');
        await provider.load();
        expect(spy).toHaveBeenCalledWith('Foo');
      });

      it('fails if provider is shut down', () => {
        provider = new CommentProvider();
        provider.destroy();
        expect(() => provider.load()).toThrow();
      });

      it('fails if no sources are available', async () => {
        provider.addStaticSource(Promise.reject('Error'), CommentProvider.SOURCE_TEXT);
        await expect(provider.load()).rejects.toBeTruthy();
      });
    });

    describe('.start', () => {
      var dynamicSource = null;
      var spy = null;

      beforeEach(() => {
        dynamicSource = {
          addEventListener: () => {}
        };
        spy = vi.spyOn(dynamicSource, 'addEventListener');
      });

      it('fails if called on destroyed object', () => {
        var p = new CommentProvider();
        p.destroy();
        expect(() => p.start()).toThrow();
      });

      it('calls load', () => {
        var loadspy = vi.spyOn(provider, 'load');
        provider.start();
        expect(loadspy).toHaveBeenCalled();
      });

      it('binds dynamic sources', async () => {
        provider.addDynamicSource(dynamicSource, CommentProvider.SOURCE_XML);
        await provider.start();
        expect(spy).toHaveBeenCalled();
      });

      it('does not bind dynamic if the static sources fail', async () => {
        provider.addDynamicSource(dynamicSource, CommentProvider.SOURCE_XML);
        provider.addStaticSource(Promise.reject('Error'), CommentProvider.SOURCE_XML);
        await expect(provider.start()).rejects.toBeTruthy();
        expect(spy.mock.calls.length).toBe(0);
      });
    });

    describe('.destory', () => {
      it('sets destroyed flag', () => {
        provider.destroy();
        expect(provider._destroyed).toBe(true);
      });

      it('destroy can be called multiple times', () => {
        provider.destroy();
        provider.destroy();
        expect(provider._destroyed).toBe(true);
      });
    });
  });
});
