import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/birthday-calculator/',  // Add this line - replace with your repo name
  build: {
    outDir: 'docs', // Build to docs/ instead of dist/
    emptyOutDir: true, // Clear the output directory before building
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['cake.svg'],
      manifest: {
        name: 'Time2Birthday',
        short_name: 'Time2Birthday',
        icons: [
          {
            src: 'cake.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ],
        start_url: './',
        display: 'standalone',
        theme_color: '#6366f1',
        background_color: '#ffffff'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
});
