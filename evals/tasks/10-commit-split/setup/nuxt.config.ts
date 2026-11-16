export default defineNuxtConfig({
  compatibilityDate: '2026-11-15',
  modules: ['@nuxt/eslint'],
  typescript: {
    strict: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Studio Démo',
    },
  },
})
