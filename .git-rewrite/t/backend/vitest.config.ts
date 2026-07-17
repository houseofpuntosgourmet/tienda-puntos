import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [],
    coverage: {
      provider: 'v8',
    },
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
