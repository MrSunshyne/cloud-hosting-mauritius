<script setup lang="ts">
const { currency, providers, MUR_PER_USD } = useHostingPlans()

const route = useRoute()

const dark = ref(false)

onMounted(() => {
  dark.value = localStorage.getItem('theme') === 'dark'
    || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  applyTheme()
})

function toggleDark() {
  dark.value = !dark.value
  localStorage.setItem('theme', dark.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  document.documentElement.classList.toggle('dark', dark.value)
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <div class="header-left">
          <NuxtLink to="/" class="header-title">
            <h1>Cloud Hosting Mauritius</h1>
          </NuxtLink>
          <nav class="header-nav">
            <NuxtLink to="/" :class="{ active: route.path === '/' }">Compare</NuxtLink>
            <NuxtLink to="/providers" :class="{ active: route.path === '/providers' }">Providers</NuxtLink>
          </nav>
        </div>
        <div class="header-actions">
          <div class="currency-toggle">
            <button
              :class="{ active: currency === 'MUR' }"
              @click="currency = 'MUR'"
            >
              MUR
            </button>
            <button
              :class="{ active: currency === 'USD' }"
              @click="currency = 'USD'"
            >
              USD
            </button>
          </div>
          <button class="theme-toggle" :title="dark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleDark">
            <svg v-if="dark" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 9.2A6.5 6.5 0 0 1 6.8 2 6 6 0 1 0 14 9.2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <NuxtPage />

    <footer class="page-footer">
      <p>
        Prices fetched March 2026. Verify on provider websites before purchasing.
        Exchange rate used: 1 USD = {{ MUR_PER_USD }} MUR.
      </p>
      <p>
        <a
          v-for="(p, i) in providers"
          :key="p.slug"
          :href="p.website"
          target="_blank"
          rel="noopener noreferrer"
        >{{ p.name }}<span v-if="i < providers.length - 1"> &middot; </span></a>
      </p>
    </footer>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

:root {
  --bg: #fafafa;
  --surface: #fff;
  --border: #e5e5e5;
  --text: #171717;
  --text-secondary: #737373;
  --text-muted: #a3a3a3;
  --table-header: #f5f5f5;
  --row-border: #f0f0f0;
  --row-hover: #fafafa;
  --active-btn-bg: #171717;
  --active-btn-text: #fff;
  --shared-bg: #fef3c7;
  --shared-text: #92400e;
  --vat-bg: #fef2f2;
  --vat-text: #991b1b;
  --vat-incl-bg: #f0fdf4;
  --vat-incl-text: #166534;
  --radius: 6px;
  --radius-lg: 8px;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', SFMono-Regular, ui-monospace, monospace;
}

html.dark {
  --bg: #0a0a0a;
  --surface: #171717;
  --border: #2e2e2e;
  --text: #e5e5e5;
  --text-secondary: #a3a3a3;
  --text-muted: #636363;
  --table-header: #1c1c1c;
  --row-border: #222;
  --row-hover: #1c1c1c;
  --active-btn-bg: #e5e5e5;
  --active-btn-text: #0a0a0a;
  --shared-bg: #422006;
  --shared-text: #fbbf24;
  --vat-bg: #450a0a;
  --vat-text: #fca5a5;
  --vat-incl-bg: #052e16;
  --vat-incl-text: #86efac;
  color-scheme: dark;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 56px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.header-title {
  text-decoration: none;
  color: inherit;
}

.header-title h1 {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.header-nav {
  display: flex;
  gap: 4px;
}

.header-nav a {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius);
  transition: all 0.15s;
}

.header-nav a:hover {
  color: var(--text);
  background: var(--bg);
}

.header-nav a.active {
  color: var(--text);
  background: var(--bg);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.currency-toggle button {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.currency-toggle button.active {
  background: var(--active-btn-bg);
  color: var(--active-btn-text);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.theme-toggle:hover {
  color: var(--text);
  background: var(--bg);
}

.page-footer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px 48px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.8;
}

.page-footer a {
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 12px 24px;
    gap: 8px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
