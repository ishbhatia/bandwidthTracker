# ⚡ Easy Tracker — AI Dashboard

A single-file, zero-server team task tracker with AI insights, Outlook integration, Redmine sync, and GitHub as the database.

---

## 🚀 How to Run

No installation required. Just open the file in Chrome.

```bash
# Option 1 — double-click the file
open employee-task-tracker.html

# Option 2 — open directly in Chrome
open -a "Google Chrome" employee-task-tracker.html
```

That's it. No Node.js, no server, no build step.

---

## ⚙️ First-Time Setup

When you open the app for the first time, a **Setup modal** appears automatically.

Fill in the following:

| Field | Value |
|-------|-------|
| GitHub Token | Your PAT from [github.com/settings/tokens](https://github.com/settings/tokens) (needs `repo` scope) |
| Repository | `ishbhatia/bandwidthTracker` |
| Branch | `main` |
| Data file path | `data.json` |
| Redmine URL | `http://svn.aps1aws.lumiq.int` |
| Redmine API Key | Your key from Redmine → My Account → API Access Key |
| Redmine Project | `oktovia-recur-df` |
| OpenAI API Key | Optional — for GPT-powered AI chat |
| Microsoft Client ID | Optional — for Outlook OAuth auto-fetch |

Click **Connect & Load** to save and connect.

---

## 📁 Project Structure

```
BandwidthTracker/
├── employee-task-tracker.html   ← Main app (entire UI + logic in one file)
├── index.html                   ← Copy for GitHub Pages hosting
├── data.json                    ← Shared task database (synced via GitHub API)
├── create-tracker.js            ← CLI to generate a fresh copy of the HTML
└── README.md                    ← This file
```

---

## 🧩 Features

| Feature | Description |
|---------|-------------|
| ⚡ Dashboard | Add/edit/delete tasks, stats, bar chart |
| 🤖 AI Insights | Auto-detects overload, blocked tasks, velocity |
| 💬 AI Chat | Ask questions about your data (local + OpenAI) |
| 📧 Outlook Scraper | Paste or auto-fetch CR/PD/DM email subjects |
| 🔗 Redmine Sync | Creates Redmine issues on task import |
| 📄 PDF Report | Weekly/Monthly report — print or save as PDF |
| 💾 GitHub Storage | Every change commits to `data.json` in GitHub |

---

## 👥 Sharing with Teammates

1. Add them as collaborator on GitHub repo
2. Send them `employee-task-tracker.html`
3. They open it → enter their own GitHub token in Setup
4. Everyone reads/writes the same `data.json` — fully shared

---

## 📧 Outlook Scraper — How to Use

### Option A — Paste subjects manually
1. Go to **📧 Outlook Scraper** tab
2. Paste subject lines (one per line)
3. Click **🔍 Parse Subjects**
4. Review the preview table
5. Click **✅ Import to Tracker + Redmine**

### Option B — Auto-fetch from Outlook
1. Go to [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
2. Sign in with your `@lumiq.ai` account
3. Click **Access token** tab → Copy the token
4. Paste in the token field in the scraper
5. Click **📧 Fetch Emails** → CR/PD/DM emails load automatically

### Task Type Detection
| Keyword in subject | Type | Redmine Tracker |
|--------------------|------|----------------|
| `CR` | Change Request / Feature | CR (id: 75) |
| `PD` | Production Defect | Bug (id: 1) — Urgent |
| `DM` | Non-Prod Defect | Bug (id: 1) — High |

---

## 🔗 Redmine Integration

When importing tasks from Outlook Scraper:
- Redmine issue is created automatically
- Issue is assigned to **Ishant Bhatia** by default
- Issue link (`🔗 #XXXXX`) appears in the task row
- Clicking the link opens the Redmine issue directly

---

## 📄 PDF Report

1. Click **📄 Report** button in the All Tasks toolbar
2. Select period: **This Week / This Month / All Time**
3. Click **🖨 Print / Save PDF**
4. In Chrome print dialog → Destination → **Save as PDF**

---

## 🔁 Git — Push to Both Repos

This project has **two separate remotes**:

| Remote | URL |
|--------|-----|
| `origin` | `https://github.com/ishbhatia/bandwidthTracker.git` |
| `lumiq` | `https://codebase.aps1aws.lumiq.int/Lumiq-Org/Easy-Tracker.git` |

### Push to GitHub only
```bash
git push origin main
```

### Push to Lumiq only
```bash
GIT_SSL_NO_VERIFY=true git push lumiq main
```

### Push to both
```bash
git push origin main
GIT_SSL_NO_VERIFY=true git push lumiq main
```

### Set up remotes from scratch
```bash
git remote add origin https://github.com/ishbhatia/bandwidthTracker.git
git remote add lumiq https://codebase.aps1aws.lumiq.int/Lumiq-Org/Easy-Tracker.git
```

---

## 🛠 CLI — Generate a Fresh HTML

Use `create-tracker.js` to generate a fresh copy of the tracker anywhere:

```bash
# Create in current folder
node create-tracker.js

# Create on Desktop
node create-tracker.js ~/Desktop

# Create in a project folder
node create-tracker.js ~/Documents/MyProject
```

Add an alias for convenience:
```bash
echo 'alias tracker="node /Users/ishantbhatia/BandwidthTracker/create-tracker.js"' >> ~/.zshrc
source ~/.zshrc

# Then just run:
tracker ~/Desktop
```

---

## 🔐 Security Notes

- GitHub token is stored in browser `localStorage` — never committed to the repo
- Redmine API key is stored in browser `localStorage` — never committed to the repo
- OpenAI key is stored in browser `localStorage` — never committed to the repo
- `data.json` is the only file that changes with task data
- Never share your tokens in chat or email

---

## 📌 Repos

| Repo | URL |
|------|-----|
| GitHub (primary) | https://github.com/ishbhatia/bandwidthTracker |
| Lumiq (internal) | https://codebase.aps1aws.lumiq.int/Lumiq-Org/Easy-Tracker |

---

*Built with ❤️ by Ishant Bhatia — Easy Tracker AI Dashboard*
