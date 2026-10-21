# ClimateX

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-57.0-000000.svg?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![UN SDG](https://img.shields.io/badge/UN_SDG-13_Climate_Action-3F7E44.svg?style=flat-square)](https://sdgs.un.org/goals/goal13)
[![License](https://img.shields.io/badge/License-MIT-6B0010.svg?style=flat-square)](LICENSE)

An offline-first, zero-subscription mobile application designed to translate climate science into hyper-local urban risk intelligence and tangible daily decarbonization. Built with a distinctive **editorial maroon-and-blush design system**, ClimateX operates directly in Expo Go without native build steps or paid API dependencies.

---

## Architecture & System Overview

```
                      +-----------------------------------+
                      |         User Location / GPS       |
                      +-----------------+-----------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
        [Open-Meteo APIs]                             [Local Storage]
  +-----------------------------+               +-----------------------------+
  | - Forecast & Wet-Bulb (C)   |               | - 30-min TTL Risk Cache     |
  | - Air Quality (AQI / PM2.5) |               | - Offline Educational Data  |
  | - River Discharge / Flood   |               | - Streak & Action History   |
  +--------------+--------------+               +--------------+--------------+
                 |                                             |
                 +----------------------+----------------------+
                                        |
                         +--------------v--------------+
                         |      ClimateX Core (App)    |
                         | - Risk Composite Engine     |
                         | - IPCC Carbon Calculator    |
                         | - Habit Recommendation      |
                         | - Floating Pill Dock UI     |
                         +--------------+--------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
        [Guest Mode (Default)]                       [Firebase Spark]
  +-----------------------------+               +-----------------------------+
  | 100% On-Device Persistence  |               | Email/Password Auth + Sync  |
  | Zero Network Auth Required  |               | Bounded Firestore Profiles  |
  +-----------------------------+               +-----------------------------+
```

---

## Core Scientific Engines

### 1. Multi-Hazard Composite Risk Engine (`lib/risk.ts`)
Rather than relying on simple linear averaging, ClimateX uses a **conservative peak-weighted blend**:

$$\text{Risk Score} = 0.6 \times \max(H, A, F) + 0.4 \times \frac{H + A + F}{3}$$

Where:
- **$H$ (Heat Hazard, 0–100):** Evaluated against Wet-Bulb and ambient temperature thresholds. Above 40°C triggers severe thermal stress scoring ($\ge 85$).
- **$A$ (Air Quality Hazard, 0–100):** Computed from European AQI metrics and microgram per cubic meter PM2.5/PM10 concentrations.
- **$F$ (Flood Hazard, 0–100):** Derived from upstream river discharge anomaly ratios against historical baseline medians.

### 2. Individual Carbon Footprint Calculator (`lib/footprint.ts`)
Calculates emissions against verified regional emission intensities:
- **Electricity Grid:** $0.82\text{ kg CO}_2\text{e/kWh}$ based on Central Electricity Authority (CEA) of India baseline database.
- **Transport Factors:** $0.17\text{ kg CO}_2\text{e/km}$ for 4-wheeler petrol/diesel commuting, $0.03\text{ kg CO}_2\text{e/km}$ for urban metro transit (DEFRA / IPCC 2023 factors).
- **Dietary Baselines:** High-meat ($3.3\text{ t CO}_2\text{e/yr}$), flexitarian ($1.9\text{ t CO}_2\text{e/yr}$), vegetarian ($1.5\text{ t CO}_2\text{e/yr}$), and vegan ($1.1\text{ t CO}_2\text{e/yr}$).
- **Benchmarking:** Contrasts personal output directly against the Paris Agreement $2.0\text{ t CO}_2\text{e/year}$ target and the Indian national average ($1.9\text{ t CO}_2\text{e/year}$).

### 3. Recommendation & Habit Rotation Engine (`lib/recommend.ts`)
- Dynamically matches 3 daily and 3 weekly habits prioritized by the user's highest personal emission driver and real-time environmental hazards (e.g., high AQI shifts focus to indoor resilience and active air-filtration practices).
- Rotates across a library of 40+ actions with a 3-day non-repeat cooldown to sustain engagement.

### 4. Local Gamification State Machine (`lib/gamification.ts`)
- **Calendar Streaks:** Tracked strictly against midnight boundaries in the device's local timezone.
- **Leveling:** $200\text{ XP}$ per level threshold ($+10\text{ XP}$ per completed action, $+25\text{ XP}$ per footprint calculation, $+30\text{ XP}$ per quiz completion).
- **Milestone Badges:** 12 unlockable badges evaluating milestone events (First Action, 7-Day Streak, Low-Carbon Hero, Quiz Master, etc.).

---

## Design System & UI Specification

Built around a bold **editorial, high-contrast palette** inspired by high-end publication aesthetics:

| Token | Hex Value | Application |
|---|---|---|
| `colors.maroon` | `#6B0010` | Primary brand accent, button fills, active elements |
| `colors.maroonDeep` | `#4A000B` | Floating dock backdrop, dark-mode surfaces |
| `colors.blush` | `#FFDDDD` | Primary canvas, cards, high-contrast readable surfaces |
| `colors.blushSoft` | `#FFEDED` | Secondary containers, inputs, tab highlights |
| `colors.ink` | `#1E1E1E` | High-emphasis display copy, pill tags |
| `colors.teal` | `#2A9D8F` | Positive achievements, sustainability indicators |

- **Typography:** Display titles in **Anton 400** (`@expo-google-fonts/anton`), analytical body and data labels in **Inter 400/500/700** (`@expo-google-fonts/inter`).
- **Floating Pill Dock:** Capsule navigation bar with circular aura touch indicators (`borderRadius: 20`), eliminating boxy native highlights.
- **Accessible Indicators:** High-contrast risk color scales (`#2E7D5B` Low, `#C98A00` Moderate, `#B3261E` Severe) meeting WCAG AA requirements.

---

## Directory Anatomy

```
climax/
├── app/
│   ├── (auth)/             # Guest, Login, and Signup entrypoints
│   ├── (onboarding)/       # Interactive baseline profiling (Name, Diet, Commute)
│   ├── (tabs)/             # Tab navigation container & screens
│   │   ├── _layout.tsx     # Custom floating pill navigation bar
│   │   ├── home.tsx        # Dashboard: Today's hazard summary, quick actions
│   │   ├── risk.tsx        # Heat, AQI, Flood breakdown with 3-day forecast
│   │   ├── footprint.tsx   # Carbon calculator with categorical breakdown
│   │   ├── actions.tsx     # Daily & weekly habit trackers
│   │   ├── progress.tsx    # Streak calendar, level progress, badges
│   │   └── learn/          # 6 offline modules with interactive quizzes
│   └── profile.tsx         # User preferences, notifications, theme toggles
├── components/             # Reusable atomic UI components
│   ├── ActionItem.tsx      # Interactive checklist card with haptics
│   ├── BadgeTile.tsx       # Unlocked and locked badge renderer
│   ├── BarChart.tsx        # Custom SVG categorical carbon bar chart
│   ├── Card.tsx            # Editorial bordered container
│   ├── Heading.tsx         # Anton uppercase header with typographic scaling
│   ├── LineChart.tsx       # 7-day risk trend sparkline
│   └── Ring.tsx            # Circular SVG risk gauge
├── data/                   # Bundled offline datasets
│   ├── actions.ts          # 40+ mitigation and resilience action definitions
│   ├── badges.ts           # 12 badge definitions and unlock conditions
│   ├── emissionFactors.ts  # IPCC / DEFRA / CEA India emission coefficients
│   └── modules.ts          # 6 climate modules and 18 curriculum quiz questions
├── lib/                    # Core logic and client wrappers
│   ├── cache.ts            # AsyncStorage cache with TTL validation
│   ├── firebase.ts         # Firebase initialization with offline fallback
│   ├── footprint.ts        # Footprint math and largest driver detection
│   ├── gamification.ts     # XP calculations and streak verification
│   ├── notifications.ts    # Safe local notification wrapper for Expo Go
│   ├── openMeteo.ts        # Hardened weather, air quality, flood client
│   ├── recommend.ts        # Action matching and rotation engine
│   └── risk.ts             # Multi-hazard composite scoring
├── store/                  # Zustand state containers
│   ├── useActions.ts       # Action completion and daily rotations
│   ├── useFootprint.ts     # Footprint category state and history
│   └── useUser.ts          # User profile, location, streak, XP, badges
├── firestore.rules         # Hardened default-deny Firestore security rules
└── package.json            # Expo SDK 57 dependencies and CVE overrides
```

---

## Security Hardening & Defenses

1. **Dependency Integrity:** `@grpc/grpc-js` pinned via `"overrides": { "@grpc/grpc-js": "^1.14.6" }` to eliminate HTTP/2 stream reset DoS vulnerabilities.
2. **SSRF & Geocoding Guards:** `lib/openMeteo.ts` bounds latitude $[-90, 90]$, longitude $[-180, 180]$, validates numerical finiteness, and sanitizes search queries to strictly alphanumeric strings.
3. **Network Resiliency:** An 8-second `AbortController` timeout wraps all external HTTP requests to prevent hanging threads.
4. **Input Sanitization & Length Limits:** Authentication forms enforce strict RFC 5322 email regex verification and length caps (Name $\le 80$, Email $\le 100$, Password $\le 128$).
5. **Database Row-Level Security:** `firestore.rules` enforces strict default-deny with ownership constraints (`request.auth.uid == userId`) and payload size limits ($< 50$ fields).

---

## Quick Start & Running Locally

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- **Expo Go** app installed on your Android (Play Store) or iOS (App Store) device

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/climatex.git
cd climatex

# Install dependencies
npm install

# Start development server
npx expo start -c
```

Scan the terminal QR code using **Expo Go** (Android) or the native **Camera** app (iOS).

### Zero-Config Mode
ClimateX automatically detects whether Firebase configuration keys exist in `.env`. If unconfigured, the app seamlessly boots into **Guest Mode**, running 100% of features locally on `AsyncStorage` with zero setup needed.

---

## Open Data Sources & Citations

- **Weather & Climate Forecasts:** [Open-Meteo Weather API](https://open-meteo.com) (Non-commercial open weather license).
- **Atmospheric Quality:** [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (Copernicus Atmosphere Monitoring Service).
- **Hydrological Forecasting:** [Open-Meteo Flood API](https://open-meteo.com/en/docs/flood-api) (Global Flood Awareness System - GloFAS).
- **Grid Emission Factors:** Central Electricity Authority (CEA), Ministry of Power, Government of India (CO₂ Baseline Database for the Indian Power Sector, v19).
- **Carbon Factors:** IPCC Sixth Assessment Report (AR6) & UK DEFRA Conversion Metrics.
