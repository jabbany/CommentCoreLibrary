/**
 * Verifies that source and build scripts only contain ASCII characters
 *
 * @description Scans src/ and build/ for non-ASCII characters. Characters
 *    outside of ASCII must be written as escapes (e.g. "\u00a0") so they
 *    survive editors and encodings unchanged.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src', 'build'];
const EXTENSIONS = /\.(ts|js|mjs|css)$/;

function listSources(dir) {
  var files = [];
  readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    var path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(listSources(path));
    } else if (EXTENSIONS.test(entry.name)) {
      files.push(path);
    }
  });
  return files;
}

var failed = 0;
ROOTS.forEach(function (root) {
  listSources(root).forEach(function (file) {
    var lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach(function (line, index) {
      var match = /[^\x00-\x7f]/.exec(line);
      if (match !== null) {
        console.error('FAIL ' + relative('.', file) + ':' + (index + 1) +
          ': non-ASCII character U+' +
          match[0].charCodeAt(0).toString(16).toUpperCase());
        failed++;
      }
    });
  });
});

if (failed > 0) {
  console.error(failed + ' line(s) contain non-ASCII characters. Use escapes instead.');
  process.exit(1);
}
console.log('ok   ' + ROOTS.join(', ') + ' are ASCII only');
