# 🇲🇾 Malaysia Data Command Center

A premium SaaS-grade intelligence dashboard powered by **data.gov.my** open data. Built with Next.js 16, React, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-CC_BY_4.0-green)

## ✨ Features

### 🎯 Command Center Interface
- **Cinematic Boot Sequence** — Terminal-style typing animation with progress indicators
- **Live Malaysia Time Clock** — Real-time MYT (UTC+8) display
- **Scrolling Data Ticker** — Live data event feed in the header
- **Dark Command-Center Aesthetic** — Scan lines, vignette overlay, particle background

### 📊 4 Dashboard Sections

#### Overview
- 6 KPI cards with animated hover effects and glow accents
- Real-time Data Engine Pulse with simulated throughput metrics
- Top 6 State Mini-Cards with rank badges
- National Performance Index with 6 animated progress bars
- Population & GDP dual-axis bar chart
- Data Frequency pie chart with center label
- 18 Category Heat Blocks with glow hover effects
- Data Source Agencies horizontal bar chart
- Data Update Timeline with color-coded event types
- Live Data Activity Feed with auto-generation

#### GeoMap
- **Real GeoJSON boundaries** from DOSM Malaysia (State, District, Parlimen layers)
- 6 switchable choropleth data layers (Population, GDP, Births, Deaths, Unemployment, Density)
- Zoom/Pan with mouse wheel + drag
- Click-to-select state detail panel
- State ranking sidebar
- State Comparison Tool (side-by-side metrics)
- Pulsing data nodes on state centroids

#### Datasets
- **287 datasets** from data.gov.my catalogued with full metadata
- Searchable and filterable table
- Category and frequency filters
- Pagination
- **Dataset Detail Drawer** — Full metadata view with description, geography, demography, source, download links
- External links to data.gov.my

#### Analytics
- GDP Trend with Forecast (actual vs projected area chart)
- GDP Growth Rate comparison bar chart
- GDP Sector Contribution horizontal bar chart
- Birth vs Death Rate dual-line trends
- Population Growth Rate line chart
- State Density Ranking horizontal bar chart
- Dependency Ratio donut chart
- **Correlation Matrix** — 6x6 heatmap with Pearson coefficients
- **Population Pyramid** — Male/Female age distribution
- **Economic Sector Treemap** — Proportional sector composition
- **Key Insights Panel** — 5 auto-generated data insights
- **Data Quality Score** — Coverage, Freshness, Completeness, Consistency metrics
- Radar chart (top 5 states comparison)
- Category Distribution bar chart
- State Metrics Matrix

### 🎨 Premium Features
- **Infographic Export** — Layer-selection modal, live preview, PNG export at 2x resolution
- **Bilingual Support** — Full English / Bahasa Malaysia (EN/MS) toggle
- **Command Palette** — Ctrl+K with searchable commands and dataset search
- **Keyboard Shortcuts** — 9 shortcuts for power users
- **Notification Center** — Slide-in panel with read/unread, category filtering
- **Scroll-to-Top Button** — Animated with glow effect
- **Live Data Alert Notifications** — Rotating data sync alerts
- **Glassmorphism Cards** — Backdrop blur effect on all panels
- **HUD Bracket Decorations** — Corner L-brackets with hover interaction
- **Animated Particle Background** — 60 subtle drifting dots

### ♿ Accessibility
- Semantic HTML with proper ARIA attributes
- Keyboard navigation support
- Skip-to-content link
- Focus-visible indicators
- Screen reader content

## 🗺️ Data Sources

| Source | Description |
|--------|-------------|
| [data.gov.my](https://data.gov.my) | Malaysia Open Data Portal |
| [DOSM](https://www.dosm.gov.my) | Department of Statistics Malaysia |
| [dosm-malaysia/data-open](https://github.com/dosm-malaysia/data-open) | DOSM Open Data GitHub — GeoJSON boundaries |
| [BNM](https://www.bnm.gov.my) | Bank Negara Malaysia |
| [MOH](https://www.moh.gov.my) | Ministry of Health Malaysia |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router (Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Export**: html2canvas
- **Icons**: Lucide React

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, animations, scan lines
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── dashboard/
│   │   ├── boot-sequence.tsx
│   │   ├── header.tsx
│   │   ├── kpi-card.tsx
│   │   ├── overview-section.tsx
│   │   ├── geomap-section.tsx
│   │   ├── datasets-section.tsx
│   │   ├── analytics-section.tsx
│   │   ├── data-engine-pulse.tsx
│   │   ├── state-mini-cards.tsx
│   │   ├── health-index.tsx
│   │   ├── data-source-stats.tsx
│   │   ├── data-activity-feed.tsx
│   │   ├── notification-center.tsx
│   │   └── infographic-export.tsx
│   ├── map/
│   │   ├── malaysia-map.tsx        # SVG map (fallback)
│   │   └── malaysia-geojson-map.tsx # GeoJSON map (primary)
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── data/
│   │   ├── malaysia-data.ts  # State metrics, layers, FAQ, citations
│   │   └── datasets.ts      # 287 dataset entries
│   └── db.ts                 # Prisma client
└── prisma/
    └── schema.prisma
```

## 📄 License

This project is licensed under **CC BY 4.0** — Data sourced from data.gov.my open data portal.

---

**Built with ❤️ using Next.js 16 | Powered by data.gov.my Open Data**
