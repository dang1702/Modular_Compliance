/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/task-overview',
  server: {
    port: 4201,
    host: 'localhost',
    cors: { origin: '*' },
  },
  preview: {
    port: 4201,
    host: 'localhost',
    cors: { origin: '*' },
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    federation({
      name: 'taskOverview',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/app/app.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand', 'recharts'],
    }),
  ],
  build: {
    outDir: '../../dist/apps/task-overview',
    emptyOutDir: true,
    reportCompressedSize: true,
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
