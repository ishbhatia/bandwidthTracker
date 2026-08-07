# ⚡ Easy Tracker — AI Dashboard
> Team task tracker with AI insights, Leave tracking, Redmine sync, and GitHub as the database. Built by **Ishant Bhatia** · © 2026 Lumiq.ai

---

## 🚀 How to Start

**Step 1 — Start the Redmine Proxy** (required for Redmine push, skip if not needed)
```bash
node redmine-proxy.js
# OR double-click StartRedmineProxy.command on Desktop
```

**Step 2 — Open the app in Chrome**
```bash
open -a "Google Chrome" index.html
```

**Step 3 — Login**
| Username | Password | Access |
|----------|----------|--------|
| `ishant` | `Ishant@123` | Admin |
| `harsh` | `Harsh@123` | Admin |
| `viewer` | `Viewer@123` | Read Only |

---

## 🛑 How to Stop

Close the proxy terminal window, or double-click **StopRedmineProxy.command** on Desktop.
The app itself needs no stopping — it's a static HTML file.

---

## �� Features

| Feature | Status |
|---------|--------|
| ⚡ Dashboard | Add/edit/delete tasks, stats, filters |
| 👤 Person View | Day-wise task breakdown per employee |
| 🗓 Leave Tracker | Mark sick leave, 30-day availability bar |
| 🤖 AI Insights | Auto-detects overload, blocked tasks, velocity |
| 🔗 Redmine Sync | Push tasks + subtasks to Redmine on add |
| 📄 PDF Report | Weekly/Monthly report — print or save as PDF |
| 💾 GitHub Storage | Every change auto-commits to `data.json` |
| 🔐 RBAC Login | Admin / Read-only user roles |
| 📧 Outlook Scraper | Coming Soon |

---

## 📁 Project Files

```
BandwidthTracker/
├── index.html                ← Main app (open this in Chrome)
├── employee-task-tracker.html← Auto-synced copy (for Lumiq server)
├── data.json                 ← Shared task database (GitHub synced)
├── redmine-proxy.js          ← CORS proxy for Redmine API
└── README.md                 ← This file
```

---

## ⚙️ First-Time Setup

Click **⚙ Setup** in the app and fill in:

| Field | Value |
|-------|-------|
| GitHub Token | PAT from github.com/settings/tokens (`repo` scope) |
| Repository | `ishbhatia/bandwidthTracker` |
| Branch | `main` |
| Data file path | `data.json` |
| Redmine URL | `http://svn.aps1aws.lumiq.int` |
| Redmine API Key | From Redmine → My Account → API Access Key |
| Redmine Project | `oktovia-recur-df` |

---

## 🔁 Push to Both Repos

```bash
git push origin main
GIT_SSL_NO_VERIFY=true git push lumiq main
```

---

## 📌 Repos

| Repo | URL |
|------|-----|
| GitHub | https://github.com/ishbhatia/bandwidthTracker |
| Lumiq | https://codebase.aps1aws.lumiq.int/Lumiq-Org/Easy-Tracker |
