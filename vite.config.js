import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.js'],
      refresh: true,
    }),
    vue(),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'resources/js'),
      // eslint-disable-next-line no-undef
      '~': path.resolve(__dirname, 'resources'),
    },
    extensions: ['.vue', '.js', '.ts', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~/assets/scss/global.scss";`,
      },
    },
  },
});
