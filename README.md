# 🛡️ Abyssinia Sec

> **Ethiopia's first and largest bug bounty and vulnerability disclosure platform.**  
> Connecting elite security researchers with forward-thinking organizations to build a safer digital Africa.

![Platform](https://img.shields.io/badge/Platform-Bug%20Bounty-00e5ff?style=flat-square&logo=shield)
![Status](https://img.shields.io/badge/Status-Live-10d98a?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-7c3aed?style=flat-square)
![Made in Ethiopia](https://img.shields.io/badge/Made%20in-Ethiopia%20🇪🇹-green?style=flat-square)

---

## 📸 Overview

Abyssinia Sec is a full-featured bug bounty web platform built for the Ethiopian cybersecurity ecosystem. It allows **security researchers** to discover and responsibly disclose vulnerabilities in exchange for monetary rewards, while giving **companies** a structured and legal way to crowdsource their security testing.

---

## ✨ Features

### For Researchers
- 🔍 Browse active bug bounty programs from Ethiopia's top organizations
- 💰 Earn rewards ($50 – $10,000+) paid via **Telebirr**, **CBE Birr**, or bank transfer
- 📋 Structured report submission with severity rating (Critical / High / Medium / Low)
- 🏆 Global leaderboard, Hall of Fame, and verified researcher certificates
- ⚖️ Full legal safe harbor — research without fear of prosecution

### For Companies
- 🚀 Launch public or private bug bounty programs in minutes
- 📥 Receive validated vulnerability reports with AI-assisted triage
- 📊 Real-time analytics — resolution rate, SLA compliance, spending dashboards
- 💳 Automated payout management with full audit trail
- 👥 Access to 1,247+ vetted Ethiopian security researchers

### Platform
- 🤖 AI-powered duplicate detection and severity scoring
- 🔒 End-to-end encrypted report submission
- 📱 Fully responsive — works on all devices
- 🌙 Futuristic dark UI with smooth animations

---

## 🗂️ Project Structure

```
abyssinia-sec/
│
├── index.html                   # Landing page
├── login-researcher.html        # Researcher login & registration
├── login-company.html           # Company login & registration
├── dashboard-researcher.html    # Researcher dashboard (SPA)
├── dashboard-company.html       # Company dashboard (SPA)
│
└── assets/
    ├── css/
    │   ├── global.css           # Design system, tokens, components
    │   ├── home.css             # Landing page styles
    │   ├── auth.css             # Auth page styles
    │   └── dashboard.css        # Dashboard styles
    │
    └── js/
        ├── global.js            # Shared utilities, particles, animations
        ├── home.js              # Landing page logic (programs, leaderboard)
        ├── auth.js              # Login / register logic
        ├── dashboard-researcher.js   # Researcher dashboard SPA router
        └── dashboard-company.js      # Company dashboard SPA router
```

---

## 🚀 Getting Started

No build tools or dependencies required. It's pure HTML, CSS, and JavaScript.

### Option 1 — Open directly
Double-click `index.html` to open in your browser.

### Option 2 — Local server (recommended)
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```
Then open `http://localhost:8080`

### Demo Login
On either login page, enter **any email** and **any password** to access the dashboard demo.

| Portal | URL |
|--------|-----|
| Landing Page | `index.html` |
| Researcher Login | `login-researcher.html` |
| Company Login | `login-company.html` |
| Researcher Dashboard | `dashboard-researcher.html` |
| Company Dashboard | `dashboard-company.html` |

---

## 🎨 Design System

Built with a custom dark-tech design language:

| Token | Value |
|-------|-------|
| Primary | `#00e5ff` (Cyan) |
| Accent | `#7c3aed` (Violet) |
| Background | `#05080f` |
| Font | Space Grotesk + Space Mono |
| Radius | 8px / 12px / 18px / 24px |

---

## 📊 Platform Stats (Demo Data)

| Metric | Value |
|--------|-------|
| Active Researchers | 1,247 |
| Active Programs | 89 |
| Bugs Found | 3,540 |
| Total Paid Out | $420,000+ |
| Resolution Rate | 93% |
| Avg Response Time | 48 hours |

---

## 🏢 Supported Organizations

- Commercial Bank of Ethiopia (CBE)
- Telebirr / Ethio Telecom
- Ethiopian Airlines
- Awash Bank
- Dashen Bank
- EthSwitch
- And 83 more...

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts (Space Grotesk, Space Mono, Inter) |
| Storage | LocalStorage (demo auth state) |

No frameworks. No build step. No dependencies to install.

---

## 📄 Pages

### Landing Page (`index.html`)
- Animated particle canvas hero
- Live terminal animation
- Program browser with category filter
- "How It Works" tab switcher (Researcher / Company)
- Global leaderboard table
- Stats with count-up animation
- Features grid, CTA section, About, Footer

### Auth Pages (`login-researcher.html` / `login-company.html`)
- Split-panel layout (form + showcase)
- Login and Register tabs
- Password strength indicator
- Role switcher pill (Researcher ↔ Company)

### Researcher Dashboard (`dashboard-researcher.html`)
Collapsible sidebar SPA with pages:
- **Overview** — KPIs, recent reports, severity breakdown, earnings chart
- **Programs** — Browse and filter all active programs
- **My Reports** — Full reports table with status tracking
- **Submit Bug** — Full report submission form with drag-and-drop PoC upload
- **Earnings** — Payment history and payout settings
- **Leaderboard** — Global researcher rankings
- **Profile** — Edit public researcher profile
- **Settings** — Password, notifications, danger zone

### Company Dashboard (`dashboard-company.html`)
- **Overview** — Open reports, SLA compliance, budget tracker
- **Programs** — Manage active bug bounty programs
- **Reports Inbox** — Triage and accept incoming reports
- **New Program** — Create and configure a new program
- **Analytics** — Monthly volume charts, vulnerability categories
- **Researchers** — Top contributors leaderboard
- **Payouts** — Payout queue with approval flow
- **Billing** — Subscription plan and payment methods

---

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Abyssinia Sec** — Addis Ababa, Ethiopia  
Built for the Ethiopian cybersecurity community 🇪🇹

> *"Securing Ethiopia's digital future, one vulnerability at a time."*
