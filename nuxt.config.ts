export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    baseURL: '/cloud-hosting-mauritius/',
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/cloud-hosting-mauritius/favicon.svg' },
      ],
      script: [
        { src: 'https://gc.zgo.at/count.js', async: true, 'data-goatcounter': 'https://cloud-hosting-mauritius.goatcounter.com/count' },
      ],
    },
  },
})
