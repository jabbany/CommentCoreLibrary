/**
 * Removes build outputs before a full build
 *
 */
import { rmSync } from 'node:fs';

['dist', 'coverage'].forEach(function (dir) {
  rmSync(dir, { recursive: true, force: true });
});
