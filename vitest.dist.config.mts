/**
 * Test configuration for the build outputs (run `pnpm build` first)
 *
 * Runs the same specs against dist/CommentCoreLibrary.js (loaded as CommonJS
 * through its UMD wrapper) together with the specs in spec/dist/ which test
 * the bundles themselves (module systems, scripting worker globals).
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'comment-core-library': fileURLToPath(new URL('./spec/support/dist.ts', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    include: ['spec/**/*.spec.ts']
  }
});
