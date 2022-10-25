import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Markdown from 'vite-plugin-vue-markdown'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'

import path from 'path'
const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),
    Unocss({ /* options */ }),
    Layouts(),
    Pages({
      dirs: 'src/views',
      extensions: ['vue', 'md'],
    }),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'logo.svg'],
      manifest: {
        name: 'logo',
        short_name: 'What Is My Blog',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/store',
        'src/composables',
      ],
      vueTemplate: true,
    }),
    Components({
      // 指定组件位置，默认是src/components
      dirs: ['src/components'],
      extensions: ['vue'],
      // 配置文件生成位置
      dts: 'src/components.d.ts'
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname,'src'),
      '~': path.resolve(__dirname,'src')
    }
  },
})
