// @vitest-environment node
/**
 * Kagerou engine worker bundles (dist/scripting)
 * Loads Worker.js into a context that emulates a Web Worker and talks to it
 * through the OOAPI message channels like the host does.
 * Set KAGEROU_DIST to test another build of dist/scripting.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const DIST = process.env.KAGEROU_DIST ||
  fileURLToPath(new URL('../../dist/scripting', import.meta.url));

function createWorker() {
  var messages = [];
  var listener = null;
  var context = vm.createContext({
    console: console,
    postMessage: function (data) {
      messages.push(JSON.parse(data));
    },
    addEventListener: function (type, callback) {
      if (type === 'message') {
        listener = callback;
      }
    },
    // Timers are recorded but never fire so nothing keeps running
    setInterval: function () { return 1; },
    clearInterval: function () { },
    setTimeout: function () { return 1; },
    clearTimeout: function () { },
    close: function () { }
  });
  context.self = context;
  context.importScripts = function () {
    for (var i = 0; i < arguments.length; i++) {
      vm.runInContext(readFileSync(join(DIST, arguments[i]), 'utf8'), context,
        { filename: arguments[i] });
    }
  };
  context.importScripts('Worker.js');

  return {
    context: context,
    messages: messages,
    run: function (code) {
      return vm.runInContext(code, context);
    },
    send: function (channel, payload) {
      listener({ data: JSON.stringify({ channel: channel, payload: payload }) });
    },
    channel: function (name) {
      return messages.filter(function (m) { return m.channel === name; });
    },
    traces: function (mode) {
      return messages.filter(function (m) {
        return m.channel === '' && m.mode === mode;
      }).map(function (m) { return m.obj; });
    }
  };
}

describe('Kagerou worker', () => {
  var worker = null;

  beforeEach(() => {
    worker = createWorker();
  });

  it('signals that it is running', () => {
    expect(worker.channel('::worker:state')).toEqual([{
      channel: '::worker:state',
      auth: 'worker',
      payload: 'running',
      callback: false
    }]);
  });

  'Runtime ScriptManager Tween Display $ Bitmap Player CommentData Utils getTimer interval timer Global $G trace load clone foreach'
    .split(' ').forEach((name) => {
      it('exposes global: ' + name, () => {
        expect(worker.context[name]).toBeDefined();
      });
    });

  it('aliases $ to Display', () => {
    expect(worker.run('$ === Display')).toBe(true);
  });

  it('extends the global scope with easing functions', () => {
    expect(worker.run('typeof linear')).toBe('function');
    expect(worker.run('Tween.linear(1, 0, 10, 2)')).toBe(5);
  });

  describe('read-only properties', () => {
    'Display.width Display.height Display.version Player.width Player.state Runtime.registeredObjects'
      .split(' ').forEach((property) => {
        it('warns and keeps ' + property, () => {
          var before = worker.run(property);
          worker.run(property + ' = 5');
          expect(worker.run(property)).toBe(before);
          expect(worker.traces('warn')).toEqual([property + ' is read-only']);
        });
      });

    it('are not enumerable', () => {
      expect(worker.run('Object.keys(Display).indexOf("width")')).toBe(-1);
      expect(worker.run('Object.keys(Display).indexOf("createComment") >= 0')).toBe(true);
    });
  });

  it('sends frame rate changes to the host', () => {
    worker.run('Display.frameRate = 30');
    expect(worker.run('Display.frameRate')).toBe(30);
    expect(worker.channel('Display:SetFrameRate')[0].payload).toBe(30);
  });

  it('receives dimension updates from the host', () => {
    worker.send('Update:DimensionUpdate', {
      stageWidth: 640,
      stageHeight: 480,
      screenWidth: 1920,
      screenHeight: 1080
    });
    expect(worker.run('Display.width')).toBe(640);
    expect(worker.run('Display.height')).toBe(480);
    expect(worker.run('Display.fullScreenWidth')).toBe(1920);
    expect(worker.run('Player.width')).toBe(640);
  });

  it('registers the meta objects and the root sprite', () => {
    var objects = worker.run('Object.keys(Runtime.registeredObjects)');
    expect(objects).toContain('__self');
    expect(objects).toContain('__player');
    expect(objects).toContain('__root');
    expect(worker.run('Display.root === Display.stage')).toBe(true);
  });

  it('registers created comments with the host', () => {
    worker.run('var c = $.createComment("hello", {lifeTime: 1, x: 10})');
    var registered = worker.channel('Runtime:RegisterObject');
    expect(registered.length).toBe(1);
    expect(registered[0].payload.id).toBe(worker.run('c.getId()'));
    expect(registered[0].payload.data.text).toBe('hello');
    expect(worker.run('Runtime.hasObject(c.getId())')).toBe(true);
  });

  it('evaluates code from the ::eval channel', () => {
    worker.send('::eval', 'trace(Utils.rgb(255, 0, 0))');
    expect(worker.traces('log')).toEqual([0xff0000]);
  });

  it('provides utility modules', () => {
    expect(worker.run('Utils.hue(0)')).toBe(0xff0000);
    expect(worker.run('Runtime.NotCrypto.toHex(255, 4)')).toBe('00ff');
    expect(worker.run('Runtime.supports("Display")')).toBe(true);
    expect(worker.run('typeof new Runtime.Timer(10).start')).toBe('function');
  });

  it('keeps a key-value store in Global', () => {
    worker.run('Global._set("key", 42)');
    expect(worker.run('$G._get("key")')).toBe(42);
  });
});
