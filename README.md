# ClimateX 🌍

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-57.0-000000.svg?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![UN SDG](https://img.shields.io/badge/UN_SDG-13_Climate_Action-3F7E44.svg?style=flat-square)](https://sdgs.un.org/goals/goal13)
[![License](https://img.shields.io/badge/License-MIT-6B0010.svg?style=flat-square)](LICENSE)

An offline-first, zero-subscription mobile application designed to translate climate science into hyper-local urban risk intelligence and tangible daily decarbonization. Built with a distinctive **editorial maroon-and-blush design system**, ClimateX operates directly in Expo Go without native build steps or paid API dependencies.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
- [Quick Start Guide](#-quick-start-guide)
- [Firebase & Google Sign-In Setup](#-firebase--google-sign-in-setup-step-by-step)
- [Scientific Methodologies & Formulas](#-scientific-methodologies--formulas)
- [Editorial Design System](#-editorial-design-system)
- [Directory Anatomy](#-directory-anatomy)
- [Security Hardening & Defenses](#-security-hardening--defenses)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [Open Data Citations](#-open-data-citations)

---

## 🏛 System Architecture

```
                      +-----------------------------------+
                      |      User Device (GPS Location)   |
                      +-----------------+-----------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
        [Open-Meteo APIs]                             [Local Storage]
  +-----------------------------+               +-----------------------------+
  | - Forecast & Wet-Bulb (°C)  |               | - 30-min TTL Risk Cache     |
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
  | 100% On-Device Persistence  |               | Email/Password + Google Auth|
  | Zero Network Auth Required  |               | Bounded Firestore Profiles  |
  +-----------------------------+               +-----------------------------+
```

---

## ✨ Core Features

1. **Personalized Composite Risk Assessment:** Real-time location-based hazard scores (0–100) combining **Heat Stress (Wet-Bulb)**, **Air Quality (AQI)**, and **Flood Discharges** with 3-day predictive outlooks.
2. **Individual Carbon Footprint Calculator:** Visualizes weekly and annual $\text{kg CO}_2\text{e}$ emissions across Transport, Electricity, Diet, and Lifestyle with IPCC/CEA India conversion factors.
3. **Automated Action & Habit Engine:** Rule-based recommendation engine suggesting 3 daily and 3 weekly habits (rotating across 40+ actions with a 3-day non-repeat cooldown).
4. **Gamification & Streak Tracking:** Calendar streaks evaluated against local midnight boundaries, leveling every $200\text{ XP}$, 7-day action trend graphs, and 12 achievement badges.
5. **Interactive Climate Learning Modules:** 6 offline-ready educational modules with swipeable cards and 3-question quizzes with instant feedback.
6. **Living Editorial Navigation Dock:** Floating maroon capsule dock with circular touch auras, eliminating boxy native highlights.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x LTS)
- [Git](https://git-scm.com/)
- **Expo Go** app installed on your physical mobile device:
  - [Download for Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [Download for iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)

### 1. Clone the Repository
```bash
git clone https://github.com/vedantdevelopes/ClimateX.git
cd ClimateX
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npx expo start -c
```

### 4. Open on Your Phone
- **Android:** Open the **Expo Go** app and tap **Scan QR Code**, then point your camera at the QR code displayed in your terminal.
- **iOS:** Open the native **Camera** app, scan the terminal QR code, and tap the prompt to open in Expo Go.

> **Zero-Config Guarantee:** If no `.env` file is present, the app automatically boots into **Guest Mode**, running 100% of features locally on `AsyncStorage` with zero configuration required.

---

## 🔐 Firebase & Google Sign-In Setup (Step-by-Step)

ClimateX uses Firebase's free **Spark Plan** (100% free, no credit card required). Follow these steps to enable Cloud Sync, Email/Password authentication, and Google Sign-In.

### Step 1: Create a Free Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g., `climatex-app`), click **Continue**, disable Google Analytics (optional, keeps setup minimal), and click **Create project**.

### Step 2: Enable Email/Password Authentication
1. In the Firebase console sidebar, navigate to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, select **Email/Password**.
4. Toggle **Enable** on for **Email/Password** (leave Email link disabled) and click **Save**.

### Step 3: Enable Google Sign-In in Firebase
1. Under the **Sign-in method** tab, click **Add new provider** and select **Google**.
2. Toggle **Enable**.
3. Choose a **Project public-facing name** (e.g., `ClimateX`) and select your **Project support email** from the dropdown.
4. Click **Save**.

### Step 4: Register a Web App & Obtain Credentials
1. Click the **Project settings** gear icon in the top-left sidebar.
2. In the **General** tab, scroll down to **Your apps** and click the **Web icon (`</>`)**.
3. Enter an app nickname (e.g., `ClimateX Mobile Web`) and click **Register app**.
4. Firebase will display your `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "climatex-app.firebaseapp.com",
     projectId: "climatex-app",
     storageBucket: "climatex-app.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:abcdef..."
   };
   ```

### Step 5: Configure Environment Variables
1. In the project root, copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Firebase values:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=climatex-app.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=climatex-app
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=climatex-app.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789...
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
   ```

### Step 6: Set Up Cloud Firestore & Security Rules
1. In the Firebase console sidebar, navigate to **Build > Firestore Database** and click **Create database**.
2. Choose a database location closest to your users (e.g., `asia-south1` for India) and click **Next**.
3. Select **Start in production mode** and click **Create**.
4. Click on the **Rules** tab in Firestore and replace the contents with the production rules from `firestore.rules`:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if false;
       }
       match /users/{userId} {
         allow read, delete: if request.auth != null && request.auth.uid == userId;
         allow create, update: if request.auth != null 
           && request.auth.uid == userId
           && request.resource.data.size() < 50
           && (!('name' in request.resource.data) || (request.resource.data.name is string && request.resource.data.name.size() <= 100))
           && (!('email' in request.resource.data) || (request.resource.data.email is string && request.resource.data.email.size() <= 120))
           && (!('location' in request.resource.data) || request.resource.data.location is map);
       }
     }
   }
   ```
5. Click **Publish**.

---

## 🔬 Scientific Methodologies & Formulas

### 1. Multi-Hazard Composite Risk Engine (`lib/risk.ts`)
Instead of a simple linear average that conceals extreme hazards, ClimateX uses a **peak-weighted conservative blend**:

$$\text{Composite Risk} = 0.6 \times \max(H, A, F) + 0.4 \times \frac{H + A + F}{3}$$

Where:
- **$H$ (Heat Hazard, 0–100):** Evaluated against Wet-Bulb and ambient temperature thresholds. Above 40°C triggers severe thermal stress scoring ($\ge 85$).
- **$A$ (Air Quality Hazard, 0–100):** Computed from European AQI metrics and microgram per cubic meter $\text{PM}_{2.5}$ / $\text{PM}_{10}$ concentrations.
- **$F$ (Flood Hazard, 0–100):** Derived from upstream river discharge anomaly ratios against historical baseline medians.

### 2. Carbon Footprint Model (`lib/footprint.ts`)
Emissions are calculated using verified regional and international emission factors:
- **Electricity Grid:** $0.82\text{ kg CO}_2\text{e/kWh}$ based on Central Electricity Authority (CEA) of India baseline database (v19).
- **Transport Factors:** $0.17\text{ kg CO}_2\text{e/km}$ for 4-wheeler petrol/diesel commuting, $0.03\text{ kg CO}_2\text{e/km}$ for urban metro transit (DEFRA / IPCC 2023 factors).
- **Dietary Baselines:** High-meat ($3.3\text{ t CO}_2\text{e/yr}$), flexitarian ($1.9\text{ t CO}_2\text{e/yr}$), vegetarian ($1.5\text{ t CO}_2\text{e/yr}$), and vegan ($1.1\text{ t CO}_2\text{e/yr}$).
- **Benchmarking:** Contrasts personal output directly against the Paris Agreement $2.0\text{ t CO}_2\text{e/year}$ target and the Indian national average ($1.9\text{ t CO}_2\text{e/year}$).

---

## 🎨 Editorial Design System

ClimateX features a custom editorial design system optimized for high readability, contrast, and visual elegance:

| Token | Hex Value | Application |
|---|---|---|
| `colors.maroon` | `#6B0010` | Primary brand accent, button fills, active indicators |
| `colors.maroonDeep` | `#4A000B` | Floating dock backdrop, dark-mode surfaces |
| `colors.blush` | `#FFDDDD` | Primary canvas, cards, high-contrast readable surfaces |
| `colors.blushSoft` | `#FFEDED` | Secondary containers, inputs, tab highlights |
| `colors.ink` | `#1E1E1E` | High-emphasis display copy, pill tags |
| `colors.teal` | `#2A9D8F` | Positive achievements, sustainability indicators |

- **Typography:** Display titles in **Anton 400** (`@expo-google-fonts/anton`), analytical body and data labels in **Inter 400/500/700** (`@expo-google-fonts/inter`).
- **Floating Pill Dock:** Capsule navigation bar with circular aura touch indicators (`borderRadius: 20`), eliminating boxy native highlights.
- **Accessible Indicators:** High-contrast risk color scales (`#2E7D5B` Low, `#C98A00` Moderate, `#B3261E` Severe) meeting WCAG AA requirements.

---

## 📁 Directory Anatomy

```
ClimateX/
├── app/
│   ├── (auth)/             # Guest, Login, and Signup screens
│   ├── (onboarding)/       # Interactive baseline profiling (Name, Diet, Commute)
│   ├── (tabs)/             # Tab navigation container & screens
│   │   ├── _layout.tsx     # Custom floating pill navigation dock
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

## 🛡 Security Hardening & Defenses

1. **Dependency Integrity:** `@grpc/grpc-js` pinned via `"overrides": { "@grpc/grpc-js": "^1.14.6", "braces": "^3.0.3" }` in `package.json` to eliminate known HTTP/2 and regex DoS vulnerabilities.
2. **SSRF & Geocoding Guards:** `lib/openMeteo.ts` bounds latitude $[-90, 90]$, longitude $[-180, 180]$, validates numerical finiteness, and sanitizes search queries to strictly alphanumeric strings.
3. **Network Resiliency:** An 8-second `AbortController` timeout wraps all external HTTP requests to prevent hanging threads.
4. **Input Sanitization & Length Limits:** Authentication forms enforce strict RFC 5322 email regex verification and length caps (Name $\le 80$, Email $\le 100$, Password $\le 128$).
5. **Database Row-Level Security:** `firestore.rules` enforces strict default-deny with ownership constraints (`request.auth.uid == userId`) and payload size limits ($< 50$ fields).

---

## ❓ Troubleshooting & FAQs

### Q: Why do I see a warning about push notifications in Expo Go?
> On Android SDK 53+, remote push notifications require a custom development build (`npx expo run:android`). ClimateX includes a guarded fallback wrapper (`lib/notifications.ts`) that runs local scheduled notifications in Expo Go without crashing.

### Q: How does offline mode work?
> All 6 learning modules and quizzes are bundled locally in `data/modules.ts`. Environmental risk scores fetched from Open-Meteo are cached in `AsyncStorage` with a 30-minute time-to-live (TTL). If network connectivity is lost, ClimateX displays cached data with an offline banner indicator.

### Q: How do I reset my progress or cached data?
> Go to the **Profile** tab (avatar in top-right of Home screen) and tap **Clear Local Cache** or switch accounts.

---

## 📚 Open Data Citations

- **Weather & Climate Forecasts:** [Open-Meteo Weather API](https://open-meteo.com) (Non-commercial open weather license).
- **Atmospheric Quality:** [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (Copernicus Atmosphere Monitoring Service).
- **Hydrological Forecasting:** [Open-Meteo Flood API](https://open-meteo.com/en/docs/flood-api) (Global Flood Awareness System - GloFAS).
- **Grid Emission Factors:** Central Electricity Authority (CEA), Ministry of Power, Government of India (CO₂ Baseline Database for the Indian Power Sector, v19).
- **Carbon Factors:** IPCC Sixth Assessment Report (AR6) & UK DEFRA Conversion Metrics.
