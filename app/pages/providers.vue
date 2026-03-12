<script setup lang="ts">
const { providers } = useHostingPlans()

useSeoMeta({
  title: 'Providers - Cloud Hosting Mauritius',
  description: 'Learn about cloud hosting providers available for Mauritius-based projects: cloud.mu, myT Cloud, GCP Johannesburg, and Rackzar.',
})
</script>

<template>
  <main class="main">
    <div class="providers-section">
      <h2>About the Providers</h2>
      <div class="provider-cards">
        <a
          v-for="p in providers"
          :key="p.slug"
          :href="p.website"
          target="_blank"
          rel="noopener noreferrer"
          class="provider-card"
          :style="{ '--accent': p.color }"
        >
          <h3>{{ p.name }}</h3>
          <span class="provider-location">{{ p.location }}</span>
          <p>{{ p.description }}</p>
        </a>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px 48px;
}

.providers-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.provider-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.provider-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition: border-color 0.15s, box-shadow 0.15s;
  text-decoration: none;
  color: inherit;
}

.provider-card:hover {
  border-color: var(--accent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 15%, transparent);
}

.provider-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}

.provider-location {
  display: inline-block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.provider-card p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
