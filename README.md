# Cloud Hosting Mauritius

Compare Linux VPS hosting prices from providers accessible to Mauritius-based projects.

## Providers

- **cloud.mu** — Local Mauritian hosting, SSD-based VPS, KVM-powered
- **myT Cloud** — Mauritius Telecom's enterprise cloud (Tier IV data center, Rose Belle)
- **GCP Johannesburg** — Google Cloud Platform africa-south1 region
- **Rackzar** — South African KVM VPS with NVMe storage

## Features

- Side-by-side comparison of 40 VPS plans across 4 providers
- Filter by provider, vCPUs (min/max), RAM (min/max), and price range
- Sort by price, vCPUs, RAM, or storage
- Currency toggle (MUR / USD)
- VAT-inclusive price toggle (15% VAT)
- Dark mode with system preference detection
- Provider info page with links to each provider

## Tech Stack

- [Nuxt 4](https://nuxt.com/) with Vue 3 Composition API
- TypeScript
- File-based routing

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Prices were fetched in March 2026
- Exchange rate: 1 USD = 46 MUR
- GCP and Rackzar prices are converted from USD/ZAR respectively
- cloud.mu prices include VAT; others are VAT-exclusive
