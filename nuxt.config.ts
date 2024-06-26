// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import ViteComponents from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Nuxt App',
      link: [{ rel: 'icon', type: 'image/*', href: '/favicon.svg' }]
    }
  },
  css: ['assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'unplugin-icons/nuxt',
    '@nuxt/ui',
    '@nuxt/eslint'
  ],
  imports: {
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n', 't']
      }
    ],
    dirs: ['./store']
  },
  runtimeConfig: {
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY
  },
  vite: {
    plugins: [
      ViteComponents({
        resolvers: [
          IconsResolver({
            componentPrefix: ''
          })
        ],
        dts: 'types/components.d.ts'
      })
    ]
  }
})
