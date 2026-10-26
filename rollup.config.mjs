/**
 * Build configuration for CommentCoreLibrary
 *
 * @description Rollup configuration for all build targets. Pick a target with
 *    `rollup -c --configTarget <target>`, or omit it to build everything.
 *     core      : builds CCL with the comment system and all modules (filter,
 *                 provider, parsers) as UMD + ESM, and the stylesheets
 *     scripting : builds the scripting engine (host and Kagerou worker API)
 */
import { readFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { minifier, swc } from './build/rollup-plugin-swc.mjs';
import { copy, css } from './build/rollup-plugin-assets.mjs';

// Read package.json to make sure it's there
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// !! Compile configurations
const LICENSE = '/*!Copyright(c) CommentCoreLibrary v' + pkg.version +
  ' (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */';

const CSS = [
  'src/css/base.css',
  'src/css/fontalias.css'
];

// Kagerou engine API modules. Each one is built from src/scripting/api/<name>.ts
// into its own worker script and installs the <name> global. They are listed
// in the order Worker.js loads them: a module may only import modules that
// are listed before it.
const KAGEROU_MODULES = ['Runtime', 'Tween', 'Display', 'Player', 'Utils'];

// Worker scripts that are not bundled and only copied
const SCRIPTING_COPY = {
  'OOAPI.js': 'src/scripting/OOAPI.js',
  'Worker.js': 'src/scripting/Worker.js',
  'api/Global.js': 'src/scripting/api/Global.js',
  'api/Function.js': 'src/scripting/api/Function.js'
};
// !! End of config area

// ==== Below this point is logic to generate compile configurations ====
// You probably do not need to edit anything below here

/**
 * When the UMD bundle is loaded with a plain <script> tag (no AMD or CommonJS),
 * also expose every export as its own global. This keeps pages that use the
 * pre-module API (e.g. `new CommentManager(stage)`) working.
 */
const LEGACY_GLOBALS = `(function (root) {
  if ((typeof exports === 'object' && typeof module !== 'undefined') ||
    (typeof define === 'function' && define.amd)) {
    return;
  }
  var lib = root.CommentCoreLibrary;
  for (var key in lib) {
    if (Object.prototype.hasOwnProperty.call(lib, key)) {
      root[key] = lib[key];
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis :
  typeof self !== 'undefined' ? self : this);`;

const API_ROOT = resolve('src/scripting/api');

/**
 * Returns the Kagerou module that owns a source file (i.e. the source file is
 * in src/scripting/api/<module>/) or null if it is not owned by any module
 */
function kagerouOwner(file) {
  var path = relative(API_ROOT, file).split(sep);
  return path.length > 1 && KAGEROU_MODULES.indexOf(path[0]) >= 0 ?
    path[0] : null;
}

/**
 * Treats imports of other Kagerou modules as externals. In the worker those
 * modules are separate scripts that expose globals, so they must be referenced
 * instead of bundled (bundling would create duplicate runtime state).
 *
 * Cross-module imports have to go through the module's main file
 * (src/scripting/api/<module>/<module>.ts) which mirrors the global.
 */
function kagerouModules(name) {
  return {
    name: 'kagerou-modules',

    async resolveId(source, importer, options) {
      if (!importer) {
        return null;
      }
      var resolved = await this.resolve(source, importer,
        Object.assign({}, options, { skipSelf: true }));
      if (resolved === null || resolved.external) {
        return resolved;
      }
      var owner = kagerouOwner(resolved.id);
      if (owner === null || owner === name) {
        return null;
      }
      var main = resolve(API_ROOT, owner, owner + '.ts');
      if (resolved.id !== main) {
        this.error('Module "' + name + '" must import "' + owner +
          '" through ' + relative('.', main) + ' (imported "' + source +
          '" in ' + relative('.', importer) + ')');
      }
      if (KAGEROU_MODULES.indexOf(owner) > KAGEROU_MODULES.indexOf(name)) {
        this.error('Module "' + name + '" cannot import "' + owner +
          '" since it is loaded after "' + name + '"');
      }
      return { id: main, external: true };
    }
  };
}

const core = {
  input: 'src/index.ts',
  plugins: [
    swc(),
    css({
      sources: CSS,
      output: 'css/style.css',
      minified: 'css/style.min.css'
    })
  ],
  output: [
    {
      file: 'dist/CommentCoreLibrary.js',
      format: 'umd',
      name: 'CommentCoreLibrary',
      banner: LICENSE,
      footer: LEGACY_GLOBALS,
      freeze: false
    },
    {
      file: 'dist/CommentCoreLibrary.min.js',
      format: 'umd',
      name: 'CommentCoreLibrary',
      banner: LICENSE,
      footer: LEGACY_GLOBALS,
      freeze: false,
      plugins: [minifier()]
    },
    {
      file: 'dist/CommentCoreLibrary.mjs',
      format: 'es',
      banner: LICENSE,
      freeze: false
    }
  ]
};

const scriptingHost = {
  input: 'src/scripting/index.js',
  plugins: [
    swc(),
    copy(SCRIPTING_COPY)
  ],
  output: {
    file: 'dist/scripting/Host.js',
    format: 'umd',
    name: 'CCLScripting',
    exports: 'default',
    banner: LICENSE,
    // The host is legacy (non-strict) JavaScript
    strict: false
  }
};

const scriptingApi = KAGEROU_MODULES.map((name) => ({
  input: 'src/scripting/api/' + name + '.ts',
  plugins: [
    kagerouModules(name),
    swc()
  ],
  output: {
    file: 'dist/scripting/api/' + name + '.js',
    format: 'iife',
    banner: LICENSE,
    globals: kagerouOwner,
    // The globals of other modules are used as-is for namespace imports
    // (instead of wrapping them in a frozen copy)
    interop: 'esModule'
  }
}));

const TARGETS = {
  core: [core],
  scripting: [scriptingHost].concat(scriptingApi)
};

export default (args) => {
  var target = args.configTarget;
  delete args.configTarget;
  if (target === undefined) {
    return TARGETS.core.concat(TARGETS.scripting);
  }
  if (!TARGETS.hasOwnProperty(target)) {
    throw new Error('Unknown build target "' + target + '". Expected one of: ' +
      Object.keys(TARGETS).join(', '));
  }
  return TARGETS[target];
};
