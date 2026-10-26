/**
 * Rollup plugin that compiles TypeScript down to ES5 using SWC
 *
 * @description TypeScript (tsc) is used only for type checking since newer
 *    versions no longer emit ES5. This plugin handles the actual emit:
 *     - resolves extensionless relative imports to .ts / .js sources
 *     - transpiles .ts sources to ES5 (keeping import/export for rollup)
 *     - bundles the SWC runtime helpers so each helper is included only once
 *    A separate output plugin (minifier) minifies the rendered chunks.
 */
import { existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify, transform } from '@swc/core';

const EXTENSIONS = ['.ts', '.js'];
const HELPERS_PREFIX = '@swc/helpers/';

/**
 * Finds the source file for an extensionless import
 * @param base - absolute path without extension
 * @returns absolute path to the source file or null if not found
 */
function resolveSource(base) {
  if (existsSync(base) && statSync(base).isFile()) {
    return base;
  }
  for (var i = 0; i < EXTENSIONS.length; i++) {
    if (existsSync(base + EXTENSIONS[i])) {
      return base + EXTENSIONS[i];
    }
  }
  return null;
}

/**
 * SWC compiler options for ES5 output
 * - loose mode emits the same plain prototype-based classes that tsc did
 * - useDefineForClassFields is off to keep tsc's assignment semantics for
 *   class fields (subclasses override accessors declared by their parents)
 */
const SWC_OPTIONS = {
  jsc: {
    parser: {
      syntax: 'typescript'
    },
    target: 'es5',
    loose: true,
    externalHelpers: true,
    transform: {
      useDefineForClassFields: false
    }
  },
  module: {
    type: 'es6'
  },
  sourceMaps: true
};

export function swc() {
  return {
    name: 'swc-es5',

    resolveId(source, importer) {
      if (source.indexOf(HELPERS_PREFIX) === 0) {
        // Use the ESM build of the helpers so rollup can bundle them
        return fileURLToPath(import.meta.resolve(source));
      }
      if (importer && (source.charAt(0) === '.' || source.charAt(0) === '/')) {
        return resolveSource(resolve(dirname(importer), source));
      }
      return null;
    },

    transform(code, id) {
      if (!/\.ts$/.test(id) || /\.d\.ts$/.test(id)) {
        return null;
      }
      return transform(code, Object.assign({ filename: id }, SWC_OPTIONS));
    }
  };
}

/**
 * Output plugin that minifies the rendered chunk with SWC
 */
export function minifier() {
  return {
    name: 'swc-minify',

    renderChunk(code) {
      return minify(code, {
        compress: true,
        mangle: true,
        sourceMap: false,
        format: {
          // Keep license headers (/*! ... */)
          comments: 'some'
        },
        ecma: 5
      });
    }
  };
}
