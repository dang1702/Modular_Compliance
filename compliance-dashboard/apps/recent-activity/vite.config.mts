/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/recent-activity',
  server: {
    port: 4203,
    host: 'localhost',
    cors: { origin: '*' },
  },
  preview: {
    port: 4203,
    host: 'localhost',
    cors: { origin: '*' },
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    federation({
      name: 'recentActivity',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/app/app.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand', 'recharts'],
    }),
  ],
  build: {
    outDir: '../../dist/apps/recent-activity',
    emptyOutDir: true,
    reportCompressedSize: true,
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
