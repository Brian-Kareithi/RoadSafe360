# RoadSafe360 🛡️

**Intelligent Driver Demerit & Road Safety Management System**

A full-stack web application that simulates how countries manage driver licences using demerit points, licence suspensions, enforcement, and road safety analytics. Built for PBL (Project-Based Learning) classrooms.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Components | Custom UI kit (Button, Card, Badge, Table, etc.) |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap |
| Icons | react-icons (Feather) |
| QR | react-qr-code |
| Backend | Firebase (Auth, Firestore, Storage) |
| Theme | Light/Dark mode with localStorage persistence |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Brian-Kareithi/RoadSafe360.git
cd RoadSafe360

# 2. Install
npm install

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and use the quick-login buttons.

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@roadsafe360.go.ke | Admin123! |
| Police | officer@roadsafe360.go.ke | Officer123! |
| Driver | driver@roadsafe360.go.ke | Driver123! |
| Authority | authority@roadsafe360.go.ke | Auth123! |

---

## Seed Data

The app comes pre-seeded with 10 Kenyan drivers, 12 offence categories, 20 sample offences, appeals, notifications, and system settings. To re-seed:

```bash
npm run seed
```

> Firebase config is hardcoded in `firebase/config.ts` — no `.env` setup needed.

---

## Features

### 🔐 Authentication
- Email/password login with role-based dashboards
- Quick-login buttons for all 4 roles
- Skeleton loading screen on sign in
- Immediate token clear + redirect on sign out

### 👥 Driver Management
- Register and search drivers by ID, name, or phone
- View complete profiles with points balance, risk score, and status
- Licence classes and endorsements tracking

### 🚦 Traffic Offences
- Issue offences with category selection and GPS location
- Interactive Leaflet map for location picking (click or geolocation)
- Driver ID auto-verification (fetches name, points, status on blur)
- Photo and evidence upload (UI ready)
- Automatic demerit point deduction

### ⚖️ Appeals
- Submit appeals with reason and evidence
- Track status: Submitted → Under Review → Approved/Rejected
- Approved appeals restore deducted points

### 📊 Dashboards

**Admin** — Total drivers, active/suspended/revoked licences, today's offences, revenue, high-risk drivers, monthly offence chart, severity pie chart, recent activity log

**Police** — Today's cases, issued offences, pending appeals, driver search, quick-issue offence

**Driver** — Personal demerit gauge, remaining points, licence status, offence history, notifications, active appeals, digital licence download

**Authority** — National KPIs, suspension rate, appeal approval rate, revenue trends, offence trends (area chart), risk prediction overview

### 📋 Reports & Analytics
- Monthly offence trends (bar/line/area charts)
- Revenue trends
- Licence status distribution (pie)
- Driver risk distribution
- Export reports as PDF, Excel, CSV (UI ready)

### 🆔 Digital Licence
- Secure digital licence card with driver photo, class, dates, points
- QR code verification
- Blood group and emergency contact
- Print and download options

### 🌍 Regions
- Regional road safety statistics (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika)
- Driver and offence counts per region

### 🎨 Theme
- Dark/Light mode toggle in the top bar
- Persisted to localStorage

### 🧭 First-Time Tutorial
- 3-step bubble hints on first login per role
- Stored in localStorage (shows once)

---

## Project Structure

```
roadsafe360/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Login page
│   ├── dashboard/        # Admin, Police, Driver, Authority
│   ├── offences/         # Offences list + new offence form
│   ├── appeals/          # Appeals list + submit form
│   ├── drivers/          # Driver search/lookup
│   ├── reports/          # Report generation
│   ├── analytics/        # Charts and data insights
│   ├── licence/          # Digital driver licence
│   ├── notifications/    # Notification centre
│   ├── regions/          # Regional statistics
│   └── settings/         # System configuration
├── components/           # Reusable UI components
│   ├── ui/               # Button, Card, Badge, Table, Input, etc.
│   ├── Sidebar.tsx       # Navigation sidebar (collapsible on mobile)
│   ├── TopBar.tsx        # Top bar with theme toggle + user menu
│   ├── DashboardShell.tsx
│   ├── MapPicker.tsx     # Leaflet map for location selection
│   ├── SkeletonLoader.tsx
│   └── FirstTimeTutorial.tsx
├── contexts/             # ThemeContext, AuthContext
├── firebase/             # Firebase config
├── hooks/                # useCollection, useDocument, addDocument, etc.
├── services/             # authService, driverService, offenceService
├── types/                # TypeScript interfaces
├── utils/                # cn(), formatCurrency, formatDate, etc.
├── seed/                 # Database seed script (Kenyan data)
├── firestore.rules       # Firebase Firestore security rules
└── storage.rules         # Firebase Storage security rules
```

---

## Firebase Console Setup

The Firebase config is already in the code. For auth to work on a custom/Vercel domain:

1. Go to **Firebase Console → Authentication → Settings → Authorized domains**
2. Add your domain (e.g. `roadsafe360.vercel.app`)

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

No environment variables needed — the Firebase config is inlined.

---

## License

MIT — Educational project for PBL.
