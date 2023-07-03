import path from 'path'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'drauu': path.resolve(__dirname, '../packages/core/src/index.ts'),
    },
  },
  plugins: [
    UnoCSS(),
  ],
  server: {
    fs: {
      strict: true,
    },
  },
  optimizeDeps: {
    exclude: [
      'drauu',
    ],
  },
})
