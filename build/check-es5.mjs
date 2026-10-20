/**
 * Verifies that all build outputs are ES5 compatible
 *
 * @description Parses every script in dist/ as ECMAScript 5. The ESM build
 *    (.mjs) may only differ from ES5 by its trailing export statement, which
 *    is stripped before parsing.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'acorn';

const DIST = 'dist';

function listScripts(dir) {
  var files = [];
  readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    var path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(listScripts(path));
    } else if (/\.m?js$/.test(entry.name)) {
      files.push(path);
    }
  });
  return files;
}

var failed = 0;
var files = listScripts(DIST);
files.forEach(function (file) {
  var code = readFileSync(file, 'utf8');
  if (/\.mjs$/.test(file)) {
    var exportStatement = /\bexport\s*\{[^}]*\};?\s*$/;
    if (!exportStatement.test(code) || /^\s*import\b/m.test(code)) {
      console.error('FAIL ' + relative('.', file) +
        ': expected a self-contained module with a single trailing export');
      failed++;
      return;
    }
    code = code.replace(exportStatement, '');
  }
  try {
    parse(code, { ecmaVersion: 5, sourceType: 'script' });
    console.log('ok   ' + relative('.', file));
  } catch (e) {
    console.error('FAIL ' + relative('.', file) + ': ' + e.message);
    failed++;
  }
});

if (files.length === 0) {
  console.error('No build outputs found in ' + DIST + '/. Run the build first.');
  process.exit(1);
}
if (failed > 0) {
  console.error(failed + ' file(s) are not ES5 compatible.');
  process.exit(1);
}
