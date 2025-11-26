/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/shell',
  server: {
    port: 4200,
    host: 'localhost',
    cors: true,
  },
  preview: {
    port: 4200,
    host: 'localhost',
    cors: true,
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    federation({
      name: 'shell',
      remotes: {
        taskOverview: 'http://localhost:4201/assets/remoteEntry.js?v=' + Date.now(),
        complianceStatus: 'http://localhost:4202/assets/remoteEntry.js?v=' + Date.now(),
        recentActivity: 'http://localhost:4203/assets/remoteEntry.js?v=' + Date.now(),
      },
      // Shared recharts to prevent duplicate React instance issues within the library
      shared: ['react', 'react-dom', 'react-router-dom', 'zustand', 'recharts'],
    }),
  ],
  build: {
    outDir: '../../dist/apps/shell',
    emptyOutDir: true,
    reportCompressedSize: true,
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
