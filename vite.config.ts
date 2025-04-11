import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
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
      }
    })
  ],
});
