import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['src/__tests__/setupEnv.ts'],
    // Handler tests import the full tool registry; 5s is tight under a full run.
    testTimeout: 20_000,
    exclude: [...configDefaults.exclude, '**/build/**'],
  },
});
