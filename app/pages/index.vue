<script setup lang="ts">
import type { SortField } from '~/composables/useHostingPlans'

const {
  selectedProviders,
  cpuFilterValue,
  cpuFilterMode,
  ramFilterValue,
  ramFilterMode,
  maxPrice,
  maxPriceLimit,
  sortField,
  sortDirection,
  hideSharedCpu,
  showWithVat,
  filteredPlans,
  cpuOptions,
  ramOptions,
  providers,
  formatPrice,
  toggleProvider,
  toggleSort,
  resetFilters,
} = useHostingPlans()

const showFilters = ref(true)
const showNotes = ref(false)

function providerColor(slug: string): string {
  return providers.find(p => p.slug === slug)?.color ?? '#888'
}

function sortIcon(field: SortField): string {
  if (sortField.value !== field) return ''
  return sortDirection.value === 'asc' ? ' \u2191' : ' \u2193'
}

useSeoMeta({
  title: 'Cloud Hosting Mauritius - VPS Comparison',
  description: 'Compare Linux VPS hosting prices from cloud.mu, myT Cloud, GCP Johannesburg, and Rackzar for Mauritius-based projects.',
})
</script>

<template>
  <main class="main">
    <button class="filter-toggle" @click="showFilters = !showFilters">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 3h14M4 8h8M6 13h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      {{ showFilters ? 'Hide' : 'Show' }} Filters
    </button>

    <div class="layout" :class="{ 'filters-hidden': !showFilters }">
      <aside v-show="showFilters" class="sidebar">
        <div class="filter-section">
          <h3>Providers</h3>
          <label
            v-for="p in providers"
            :key="p.slug"
            class="provider-checkbox"
          >
            <input
              type="checkbox"
              :checked="selectedProviders.includes(p.slug)"
              @change="toggleProvider(p.slug)"
            >
            <span class="provider-dot" :style="{ background: p.color }" />
            <span>{{ p.name }}</span>
          </label>
        </div>

        <div class="filter-section">
          <div class="filter-header">
            <h3>vCPUs</h3>
            <div class="mode-toggle">
              <button :class="{ active: cpuFilterMode === 'min' }" @click="cpuFilterMode = 'min'">Min</button>
              <button :class="{ active: cpuFilterMode === 'max' }" @click="cpuFilterMode = 'max'">Max</button>
            </div>
          </div>
          <select v-model.number="cpuFilterValue">
            <option v-for="c in cpuOptions" :key="c" :value="c">
              {{ c === 0 ? 'Any' : cpuFilterMode === 'min' ? `${c}+ vCPUs` : `Up to ${c} vCPUs` }}
            </option>
          </select>
        </div>

        <div class="filter-section">
          <div class="filter-header">
            <h3>RAM</h3>
            <div class="mode-toggle">
              <button :class="{ active: ramFilterMode === 'min' }" @click="ramFilterMode = 'min'">Min</button>
              <button :class="{ active: ramFilterMode === 'max' }" @click="ramFilterMode = 'max'">Max</button>
            </div>
          </div>
          <select v-model.number="ramFilterValue">
            <option v-for="r in ramOptions" :key="r" :value="r">
              {{ r === 0 ? 'Any' : ramFilterMode === 'min' ? `${r}+ GB` : `Up to ${r} GB` }}
            </option>
          </select>
        </div>

        <div class="filter-section">
          <h3>Max Price (MUR/month)</h3>
          <input
            v-model.number="maxPrice"
            type="range"
            :min="0"
            :max="maxPriceLimit"
            :step="100"
          >
          <span class="range-value">Rs {{ maxPrice.toLocaleString() }}</span>
        </div>

        <div class="filter-section">
          <label class="provider-checkbox">
            <input v-model="showWithVat" type="checkbox">
            <span>Show prices with VAT (15%)</span>
          </label>
          <label class="provider-checkbox">
            <input v-model="showNotes" type="checkbox">
            <span>Show notes column</span>
          </label>
          <label class="provider-checkbox">
            <input v-model="hideSharedCpu" type="checkbox">
            <span>Hide shared CPU plans</span>
          </label>
        </div>

        <button class="reset-btn" @click="resetFilters">
          Reset Filters
        </button>
      </aside>

      <section class="content">
        <div class="results-bar">
          <span class="results-count">{{ filteredPlans.length }} plans</span>
          <div class="sort-buttons">
            <span class="sort-label">Sort:</span>
            <button :class="{ active: sortField === 'price' }" @click="toggleSort('price')">
              Price{{ sortIcon('price') }}
            </button>
            <button :class="{ active: sortField === 'vcpus' }" @click="toggleSort('vcpus')">
              vCPUs{{ sortIcon('vcpus') }}
            </button>
            <button :class="{ active: sortField === 'ram' }" @click="toggleSort('ram')">
              RAM{{ sortIcon('ram') }}
            </button>
            <button :class="{ active: sortField === 'storage' }" @click="toggleSort('storage')">
              Storage{{ sortIcon('storage') }}
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="plans-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Plan</th>
                <th class="num sortable" @click="toggleSort('vcpus')">
                  vCPUs{{ sortIcon('vcpus') }}
                </th>
                <th class="num sortable" @click="toggleSort('ram')">
                  RAM{{ sortIcon('ram') }}
                </th>
                <th class="num sortable" @click="toggleSort('storage')">
                  Storage{{ sortIcon('storage') }}
                </th>
                <th>Bandwidth</th>
                <th class="num sortable" @click="toggleSort('price')">
                  Price/mo{{ sortIcon('price') }}
                </th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="plan in filteredPlans" :key="plan.id">
                <tr>
                  <td>
                    <span class="provider-badge" :style="{ '--c': providerColor(plan.providerSlug) }">
                      {{ plan.provider }}
                    </span>
                  </td>
                  <td class="plan-name">{{ plan.name }}</td>
                  <td class="num">
                    <span v-if="plan.sharedCpu" class="shared-tag">shared</span>
                    {{ plan.vcpus }}
                  </td>
                  <td class="num">{{ plan.ramGb }} GB</td>
                  <td class="num">
                    <template v-if="plan.storageGb > 0">
                      {{ plan.storageGb }} GB {{ plan.storageType }}
                    </template>
                    <span v-else class="muted">{{ plan.storageType }}</span>
                  </td>
                  <td>{{ plan.bandwidth }}</td>
                  <td class="num price-cell">
                    <template v-if="showWithVat">
                      <span class="vat-tag vat-incl">VAT incl.</span>
                    </template>
                    <template v-else>
                      <span v-if="!plan.vatInclusive" class="vat-tag">+VAT</span>
                      <span v-else class="vat-tag vat-incl">VAT incl.</span>
                    </template>
                    <strong>{{ formatPrice(plan) }}</strong>
                  </td>
                  <td class="location-cell">{{ plan.location }}</td>
                </tr>
                <tr v-if="showNotes && plan.notes" class="notes-row">
                  <td colspan="8" class="notes-cell">{{ plan.notes }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div v-if="filteredPlans.length === 0" class="empty-state">
          No plans match your filters. Try adjusting your criteria.
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px 48px;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
  align-items: start;
}

.layout.filters-hidden {
  grid-template-columns: 1fr;
}

.sidebar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  position: sticky;
  top: 72px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.filter-header h3 {
  margin-bottom: 0;
}

.filter-section h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.mode-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.mode-toggle button {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  border: none;
  background: var(--surface);
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s;
}

.mode-toggle button.active {
  background: var(--active-btn-bg);
  color: var(--active-btn-text);
}

.provider-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
}

.provider-checkbox input {
  accent-color: var(--text);
}

.provider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.filter-section select {
  width: 100%;
  padding: 7px 10px;
  font-size: 13px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
}

.filter-section input[type="range"] {
  width: 100%;
  accent-color: var(--text);
}

.range-value {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.reset-btn {
  width: 100%;
  padding: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
}

.reset-btn:hover {
  background: var(--bg);
}

.content {
  min-width: 0;
}

.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
  flex-wrap: wrap;
}

.results-count {
  font-size: 13px;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}

.sort-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sort-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-right: 4px;
}

.sort-buttons button {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
  white-space: nowrap;
}

.sort-buttons button.active {
  background: var(--active-btn-bg);
  color: var(--active-btn-text);
  border-color: var(--active-btn-bg);
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.plans-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.plans-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.plans-table th {
  background: var(--table-header);
  padding: 10px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  user-select: none;
}

.plans-table th.sortable {
  cursor: pointer;
}

.plans-table th.sortable:hover {
  color: var(--text);
}

.plans-table th.num,
.plans-table td.num {
  text-align: right;
}

.plans-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--row-border);
  vertical-align: middle;
}

.plans-table tr:last-child td {
  border-bottom: none;
}

.plans-table tr:hover td {
  background: var(--row-hover);
}

.provider-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  white-space: nowrap;
}

.plan-name {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.shared-tag {
  display: inline-block;
  padding: 1px 5px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 3px;
  background: var(--shared-bg);
  color: var(--shared-text);
  margin-right: 4px;
  vertical-align: middle;
}

.price-cell {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.vat-tag {
  display: inline-block;
  padding: 1px 4px;
  font-size: 10px;
  font-weight: 500;
  border-radius: 3px;
  background: var(--vat-bg);
  color: var(--vat-text);
  margin-right: 4px;
  vertical-align: middle;
}

.vat-tag.vat-incl {
  background: var(--vat-incl-bg);
  color: var(--vat-incl-text);
}

.muted {
  color: var(--text-muted);
  font-size: 12px;
}

.location-cell {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.notes-row td {
  border-bottom: 1px solid var(--row-border);
}

.notes-row .notes-cell {
  padding: 0 12px 10px;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
}

.notes-row + tr td,
tr:has(+ .notes-row) td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .sort-buttons {
    flex-wrap: wrap;
  }

  .notes-row .notes-cell {
    font-size: 11px;
  }
}
</style>
