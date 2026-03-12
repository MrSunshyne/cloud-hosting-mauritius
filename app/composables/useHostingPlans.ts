import { plans, providers, MUR_PER_USD, type HostingPlan } from '~/data/plans'

export type SortField = 'price' | 'vcpus' | 'ram' | 'storage'
export type SortDirection = 'asc' | 'desc'
export type Currency = 'MUR' | 'USD'
export type FilterMode = 'min' | 'max'

// Module-level shared state (singleton across all callers)
const maxPriceLimit = Math.max(...plans.map(p => p.priceMur))
const selectedProviders = ref<string[]>(['cloud-mu', 'myt-cloud', 'gcp', 'rackzar'])
const cpuFilterValue = ref(0)
const cpuFilterMode = ref<FilterMode>('min')
const ramFilterValue = ref(0)
const ramFilterMode = ref<FilterMode>('min')
const maxPrice = ref(maxPriceLimit)
const sortField = ref<SortField>('price')
const sortDirection = ref<SortDirection>('asc')
const currency = ref<Currency>('MUR')
const hideSharedCpu = ref(false)
const showWithVat = ref(false)

const VAT_RATE = 0.15

export function useHostingPlans() {
  function effectivePriceMur(plan: HostingPlan): number {
    if (showWithVat.value && !plan.vatInclusive) {
      return Math.round(plan.priceMur * (1 + VAT_RATE))
    }
    return plan.priceMur
  }

  const filteredPlans = computed(() => {
    const result = plans.filter((plan) => {
      if (!selectedProviders.value.includes(plan.providerSlug)) return false

      if (cpuFilterValue.value > 0) {
        if (cpuFilterMode.value === 'min' && plan.vcpus < cpuFilterValue.value) return false
        if (cpuFilterMode.value === 'max' && plan.vcpus > cpuFilterValue.value) return false
      }

      if (ramFilterValue.value > 0) {
        if (ramFilterMode.value === 'min' && plan.ramGb < ramFilterValue.value) return false
        if (ramFilterMode.value === 'max' && plan.ramGb > ramFilterValue.value) return false
      }

      if (plan.priceMur > maxPrice.value) return false
      if (hideSharedCpu.value && plan.sharedCpu) return false
      return true
    })

    result.sort((a, b) => {
      let aVal: number
      let bVal: number
      switch (sortField.value) {
        case 'price':
          aVal = effectivePriceMur(a)
          bVal = effectivePriceMur(b)
          break
        case 'vcpus':
          aVal = a.vcpus
          bVal = b.vcpus
          break
        case 'ram':
          aVal = a.ramGb
          bVal = b.ramGb
          break
        case 'storage':
          aVal = a.storageGb
          bVal = b.storageGb
          break
        default: {
          const _exhaustive: never = sortField.value
          aVal = 0
          bVal = 0
        }
      }
      return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
    })

    return result
  })

  const cpuOptions = computed(() => {
    const cpus = [...new Set(plans.map(p => p.vcpus))].sort((a, b) => a - b)
    return [0, ...cpus]
  })

  const ramOptions = computed(() => {
    const rams = [...new Set(plans.map(p => p.ramGb))].sort((a, b) => a - b)
    return [0, ...rams]
  })

  function formatPrice(plan: HostingPlan): string {
    const mur = effectivePriceMur(plan)
    if (currency.value === 'USD') {
      return `$${(mur / MUR_PER_USD).toFixed(2)}`
    }
    return `Rs ${mur.toLocaleString()}`
  }

  function toggleProvider(slug: string) {
    const idx = selectedProviders.value.indexOf(slug)
    if (idx >= 0) {
      selectedProviders.value.splice(idx, 1)
    } else {
      selectedProviders.value.push(slug)
    }
  }

  function toggleSort(field: SortField) {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }

  function resetFilters() {
    selectedProviders.value = ['cloud-mu', 'myt-cloud', 'gcp', 'rackzar']
    cpuFilterValue.value = 0
    cpuFilterMode.value = 'min'
    ramFilterValue.value = 0
    ramFilterMode.value = 'min'
    maxPrice.value = maxPriceLimit
    hideSharedCpu.value = false
    sortField.value = 'price'
    sortDirection.value = 'asc'
  }

  return {
    selectedProviders,
    cpuFilterValue,
    cpuFilterMode,
    ramFilterValue,
    ramFilterMode,
    maxPrice,
    maxPriceLimit,
    sortField,
    sortDirection,
    currency,
    hideSharedCpu,
    showWithVat,
    filteredPlans,
    cpuOptions,
    ramOptions,
    providers,
    MUR_PER_USD,
    formatPrice,
    toggleProvider,
    toggleSort,
    resetFilters,
  }
}
