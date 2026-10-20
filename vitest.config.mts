/**
 * Test configuration for the library sources
 *
 * Specs import the library as 'comment-core-library' (i.e. through its public
 * API). Here that resolves to the TypeScript sources so coverage is reported
 * against them. See vitest.dist.config.mts for testing the build outputs.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'comment-core-library': fileURLToPath(new URL('./src/index.ts', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    include: ['spec/**/*.spec.ts'],
    exclude: ['spec/dist/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // The scripting engine runs in a worker and is tested through its build
      // outputs (spec/dist), so it is not part of the source coverage report
      exclude: ['src/**/*.d.ts', 'src/scripting/**'],
      reporter: ['text', 'html', 'lcov']
    }
  }
});
