import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(async ({ vueApp }) => {
  const locales = ['en', 'fr']

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any = {}

  for (const locale of locales) {
    messages[locale] = await import(`../locales/${locale}.json`)
  }
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages
  })

  vueApp.use(i18n)
})
