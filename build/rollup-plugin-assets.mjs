/**
 * Rollup plugins for non-JavaScript build outputs
 *
 * @description
 *  css  : concatenates, vendor-prefixes and minifies stylesheets
 *  copy : copies files verbatim (for scripts that must not be bundled)
 */
import { readFileSync } from 'node:fs';
import { transform } from 'lightningcss';

/**
 * Oldest browsers that we generate CSS vendor prefixes for. This mirrors what
 * the ES5 JavaScript output supports. Versions are encoded as major << 16.
 */
const CSS_TARGETS = {
  android: 4 << 16,
  chrome: 30 << 16,
  firefox: 30 << 16,
  ie: 10 << 16,
  ios_saf: 7 << 16,
  opera: 17 << 16,
  safari: 7 << 16
};

/**
 * @param options.sources - list of css files to concatenate
 * @param options.output - output file name (relative to the output dir)
 * @param options.minified - minified output file name
 */
export function css(options) {
  return {
    name: 'css',

    buildStart() {
      var source = options.sources.map((file) => {
        this.addWatchFile(file);
        return readFileSync(file, 'utf8');
      }).join('\n');
      var outputs = [[options.output, false], [options.minified, true]];
      outputs.forEach(([fileName, minify]) => {
        var result = transform({
          filename: fileName,
          code: Buffer.from(source),
          minify: minify,
          targets: CSS_TARGETS
        });
        this.emitFile({
          type: 'asset',
          fileName: fileName,
          source: result.code
        });
      });
    }
  };
}

/**
 * @param files - map of output file name (relative to output dir) to source
 */
export function copy(files) {
  return {
    name: 'copy',

    buildStart() {
      for (var fileName in files) {
        this.addWatchFile(files[fileName]);
        this.emitFile({
          type: 'asset',
          fileName: fileName,
          source: readFileSync(files[fileName])
        });
      }
    }
  };
}
