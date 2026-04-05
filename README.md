# Zorvyn — Finance Dashboard

> A modern, responsive finance dashboard built as part of a Frontend Developer Intern assignment. Designed to feel like a real fintech product with intelligent insights, interactive charts, role-based UI, and a built-in AI assistant which operates entirely on the frontend.

🔗 **Live Demo:** [https://zorvyn-assignment-seven-puce.vercel.app/]

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [How to Use](#how-to-use)
7. [Approach & Design Decisions](#approach--design-decisions)
8. [State Management](#state-management)
9. [Role-Based UI](#role-based-ui)
10. [Data Persistence](#data-persistence)
11. [Export Functionality](#export-functionality)
12. [Deployment](#deployment)
13. [Author](#author)

---

## Overview

Zorvyn is a frontend-only finance dashboard which enables users to monitor income, expenses, and savings in a clean, dark-themed interface. It was built to demonstrate skills in UI design, component architecture, data visualization, state management, and responsive layout without any backend or database dependency.

All data is mock-generated and stored locally in the browser. The app simulates a real fintech product experience with features like animated charts, smart financial insights, role-based access control, export functionality, and an AI chat assistant.

---

## Features

### Dashboard Overview
- **Summary Cards** showing Total Balance, Total Income, Total Expenses, and Total Savings
- Each card includes a trend indicator (percentage change vs last month) with color-coded arrows
- Cards animate in on load with a staggered fade-up effect
- Shimmer skeleton placeholders are shown during the simulated loading phase

### Data Visualizations
- **Line Chart** — Tracks income, expenses, and savings over the last 6 months
- **Donut Pie Chart** — Shows expense breakdown by category with a 2-column percentage legend below the chart
- **Bar Chart** — Side-by-side monthly income vs expenses comparison
- All charts include hover tooltips with formatted INR values
- Charts render with smooth animations on page load

### Transactions Section
- Full transactions table with columns: Date, Description, Category, Type, Amount, Status
- Color-coded amounts — green for income, red for expense
- Status badges — completed, pending, failed
- Category icons for quick visual scanning

### Filtering, Sorting & Search
- **Filter by Category** — All, Food, Transport, Shopping, Utilities, Entertainment, Health, Savings, Freelance, Salary
- **Filter by Type** — All, Income, Expense
- **Sort by** — Date, Amount, or Category
- **Sort Direction** — Toggle between Ascending and Descending
- **Live Search** — Searches across description and category in real time
- **Clear All** button appears when any filter is active
- Empty state UI shown when no results match the active filters

### Role-Based UI
- **Admin** — Can add new transactions, delete existing ones, and export data
- **Viewer** — Read-only mode; add/delete controls are hidden from the UI
- Role can be switched at any time via the sidebar dropdown or the Settings page
- No authentication required — purely a frontend simulation

### Insights Panel
- Smart financial observations generated from the transaction data
- Examples: highest spending category, current savings rate, budget alerts, income growth
- Displayed as small cards with color-coded labels and category icons

### AI Chat Assistant
- Floating chat button fixed to the bottom-right corner
- Opens a minimal chat panel styled like a modern AI assistant
- Responds to natural language queries such as:
  - *"How much did I spend?"*
  - *"Where did my money go?"*
  - *"How can I save more?"*
  - *"What is my budget status?"*
- Includes quick-reply suggestion chips for common questions
- Messages auto-scroll to the latest reply

### Notifications
- Bell icon in the topbar with an unread count badge
- Dropdown panel lists recent alerts such as salary credits, bill due reminders, and savings milestones
- Click any notification to mark it as read
- "Mark all read" button clears all unread indicators
- Dropdown renders above all other UI elements (no overlap with charts)

### Theme Brightness
- A dedicated brightness control lives in **Settings → Theme Brightness**
- A smooth **range slider** lets you dial the brightness anywhere from 50% (very dark) to 140% (extra bright)
- Three **preset buttons** — Dim, Normal, and Bright — offer quick one-click adjustments
- The current mode is shown as a labelled badge (🌑 Dim · 🌕 Normal · ☀️ Bright) that updates live
- The brightness is applied via a CSS `filter: brightness()` on the root wrapper, so it affects every element including charts, cards, and the sidebar uniformly
- The selected value is shown as a live percentage next to the slider for precision

### Settings Page
- Adjust theme brightness with a slider and presets
- Switch roles between Admin and Viewer
- Export transactions as CSV or JSON
- Reset all data back to the original mock dataset

### Responsive Design
- Fully responsive across desktop, tablet, and mobile screen sizes
- Desktop: collapsible sidebar that can be toggled to icon-only mode
- Mobile: sidebar replaced with a hamburger menu that opens a slide-in drawer
- All cards, charts, and tables adapt gracefully to smaller screens

### Data Persistence
- Transactions are automatically saved to the browser's `localStorage` after every add or delete
- On page reload, the saved data is restored so nothing is lost between sessions
- If no saved data exists, the app falls back to the original 20 mock transactions
- A **Reset to Defaults** option in Settings wipes the saved data and restores the original dataset

### Mock API Integration
- On first load, the app simulates a real API fetch with a 1.4 second delay
- During this delay, all cards and charts display animated **shimmer skeleton** placeholders
- Once the delay resolves, content fades in — mimicking the feel of a live data fetch
- No actual network request is made; the simulation is handled entirely with `setTimeout`

### Animations and Transitions
- Summary cards animate in with a **staggered fade-up effect** on page load, each delayed by 70ms
- Cards lift slightly on hover with a smooth scale and shadow transition
- Chart bars and lines render with built-in Recharts entry animations
- The notification dropdown, chat panel, and modal all fade in smoothly on open
- Sidebar collapse and expand transitions are animated with CSS `transition-all`

### Export Functionality
- Filtered transactions can be downloaded as **CSV** (for Excel or Google Sheets) or **JSON** (for developers)
- Only the currently visible filtered and sorted rows are exported — not the full dataset
- The CSV includes headers: Date, Description, Category, Amount, Type, Status
- The JSON export is formatted with 2-space indentation for readability

### Advanced Filtering and Grouping
- Filters can be **stacked** — category, type, and search all apply simultaneously
- Sort field (Date, Amount, Category) and sort direction (Ascending, Descending) work on top of active filters
- A **Clear All** button appears whenever any filter is active, resetting everything in one click
- The result count updates live as filters change, showing how many records match

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI component framework |
| Vite | 5 | Build tool and development server |
| Tailwind CSS | 3 | Utility-first CSS styling |
| Recharts | Latest | Line, Bar, and Pie chart components |
| localStorage API | Browser native | Client-side data persistence |

No external state management library, no backend, no database.

---

## Project Structure

```
zorvyn-assignment/
│
├── public/                     # Static assets
│
├── src/
│   ├── FinanceDashboard.jsx    # Main dashboard — all components in one file
│   ├── App.jsx                 # Root component, renders FinanceDashboard
│   └── index.css               # Tailwind CSS directives
│
├── index.html                  # HTML entry point
├── tailwind.config.js          # Tailwind content paths configuration
├── vite.config.js              # Vite build configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or above → [nodejs.org](https://nodejs.org)
- **npm** v9 or above (comes with Node.js)

Verify your versions:

```bash
node -v
npm -v
```

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/zorvyn-assignment.git
cd zorvyn-assignment
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Install Recharts

```bash
npm install recharts
```

---

### Step 4 — Install Tailwind CSS

> Use Tailwind v3 specifically. Version 4 has a different setup process and may not work correctly with this project.

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

---

### Step 5 — Configure Tailwind

Open `tailwind.config.js` and make sure it looks like this:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Open `src/index.css` and replace all contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Step 6 — Add the Dashboard Component

Place `FinanceDashboard.jsx` inside the `src/` folder.

Open `src/App.jsx` and replace its contents with:

```jsx
import FinanceDashboard from './FinanceDashboard'

function App() {
  return <FinanceDashboard />
}

export default App
```

---

### Step 7 — Run the Development Server

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:5173
```

The dashboard should be live and fully functional.

---

### Common Issues

| Problem | Fix |
|---|---|
| `could not determine executable to run` on `npx tailwindcss init` | Run `npm install -D tailwindcss@3 postcss autoprefixer` first, then retry |
| Styles not applying | Check that `index.css` has the three `@tailwind` directives and is imported in `main.jsx` |
| Charts not rendering | Run `npm install recharts` to make sure the package is installed |
| Date shows `######` in Excel export | Double-click the column A border in Excel to auto-fit the width |

---

## How to Use

### Navigating the App

The sidebar on the left is your primary navigation. Click any item to switch pages instantly. On desktop, click the **◂ arrow** at the very bottom of the sidebar to collapse it into a compact icon-only rail — each icon shows a tooltip on hover so you always know where you are. Click **▸** to expand it back to full width. On mobile, the sidebar is hidden by default; tap the **☰ hamburger icon** in the top-left corner of the topbar to slide it open as a drawer overlay.

| Page | What it shows |
|---|---|
| Dashboard | Summary cards, all three charts, insights panel, recent transactions |
| Transactions | Full transaction table with filtering, sorting, search, and export |
| Analytics | KPI metrics, category breakdown bars, 6-month savings trend, detailed insights |
| Settings | Theme brightness control, role switcher, export buttons, data reset |

### Adding a Transaction (Admin only)

1. Switch role to **Admin** in the sidebar dropdown
2. Click the **+ Add Transaction** button (top-right of Dashboard or Transactions page)
3. Fill in Date, Description, Category, Type, and Amount
4. Click **Add Transaction** — it appears instantly in the table and updates all charts

### Switching Roles

Use the dropdown in the sidebar labelled **Role** to switch between:
- **Admin** — full access including add and delete
- **Viewer** — read-only, action buttons are hidden

### Adjusting Theme Brightness

Go to **Settings → Theme Brightness** to control how bright or dim the entire dashboard appears:
- Drag the **slider** left for a darker display or right for a brighter one — the value shows live as a percentage
- Use the **Dim / Normal / Bright** preset buttons for quick one-click adjustments
- The current mode is shown as a label (🌑 Dim, 🌕 Normal, ☀️ Bright) in the top-right of the setting card
- The brightness change applies instantly to the whole app with no page reload

### Using the Chat Assistant

1. Click the **💬 button** fixed to the bottom-right corner
2. Type a question or click one of the suggestion chips
3. Try asking: *"How much did I spend?"*, *"Where did my money go?"*, *"How can I save more?"*

### Exporting Data

Go to the **Transactions** page and use:
- **↓ CSV** — downloads a `.csv` file openable in Excel or Google Sheets
- **↓ JSON** — downloads a `.json` file with structured transaction data

Only the currently filtered transactions are exported.

---

## Approach & Design Decisions

### Single Component Architecture

The entire dashboard lives in one file — `FinanceDashboard.jsx`. This was an intentional decision for the assignment submission to make the code easy to review end-to-end without jumping across many files. In a production codebase, this would be split into:

- Separate page components (`DashboardPage`, `TransactionsPage`, etc.)
- Reusable UI components (`SummaryCard`, `ChartCard`, `TransactionTable`)
- Custom hooks (`useTransactions`, `useFilters`)
- A routing layer using React Router

### No External State Library

React's built-in `useState` and `useEffect` are used throughout. Adding Redux, Zustand, or Context API would have been over-engineering for this scope. The state is flat, co-located, and easy to trace — which is the right call for a dashboard of this size.

### Tailwind CSS over CSS Modules

Tailwind was chosen for three reasons:
1. **Speed** — utility classes allow rapid iteration without context switching between files
2. **Consistency** — the design token system (spacing, colors, sizing) enforces visual consistency automatically
3. **Responsive utilities** — `sm:`, `md:`, `lg:` prefixes make responsive design declarative and readable

### Recharts over D3

Recharts was chosen because it integrates naturally with React's component model. D3 is more powerful but requires manual DOM manipulation, which fights against React's rendering approach. Recharts gives clean, animated charts with a simple JSX API.

### Dark Theme

A `gray-950` dark background was chosen to give the app a premium fintech feel — similar to products like Groww, Zerodha, or Revolut. The color palette uses indigo/purple for primary actions, emerald for income/positive values, and rose for expenses/alerts.

### INR Currency Formatting

All monetary values are formatted using the Indian numbering system:
- Values above ₹1,00,000 display as `₹1.0L` (lakhs)
- Values above ₹1,000 display as `₹1.0K`
- Full values are shown in transaction tables using `Intl.NumberFormat` with `en-IN` locale

---

## State Management

All state is managed locally using React hooks. Here is a breakdown of the key state variables:

| State Variable | Type | Purpose |
|---|---|---|
| `transactions` | Array | The full list of transactions, synced to localStorage |
| `role` | String | Current user role — `"admin"` or `"viewer"` |
| `activeNav` | String | Currently active page/tab |
| `loading` | Boolean | Controls shimmer skeleton display on initial load |
| `filterCategory` | String | Active category filter on transactions |
| `filterType` | String | Active type filter (income/expense/all) |
| `searchQuery` | String | Live search text |
| `sortField` | String | Field to sort transactions by |
| `sortDir` | String | Sort direction — `"asc"` or `"desc"` |
| `brightness` | Number | CSS filter brightness value (0.5–1.4), controls whole-app brightness |
| `showNotif` | Boolean | Controls notification dropdown visibility |
| `showChat` | Boolean | Controls chat panel visibility |
| `chatMessages` | Array | Full conversation history in the chat assistant |
| `notifications` | Array | Notification list with read/unread state |

Derived values like `income`, `expenses`, `balance`, `pieData`, and `filteredTxns` are computed directly from state on every render — no need to store them separately.

---

## Role-Based UI

The app simulates two roles entirely on the frontend. No authentication or backend is involved.

### Admin
- **+ Add Transaction** button is visible on Dashboard and Transactions pages
- **Delete** button is shown on each transaction row
- Full access to export and settings

### Viewer
- Add and Delete controls are hidden from the UI using conditional rendering
- All data and charts remain fully visible
- Export buttons are also hidden in Viewer mode

To switch roles, use the **Role dropdown** in the sidebar or go to **Settings → Current Role**.

---

## Data Persistence

Transactions are saved to the browser's `localStorage` automatically after every change.

- **Key used:** `zorvynTransactions`
- **When saved:** Every time the `transactions` state changes (add, delete, or reset)
- **When loaded:** On first render, before the loading skeleton appears
- **Fallback:** If localStorage is empty or corrupted, the original 20 mock transactions are loaded

To clear all data and go back to the defaults, go to **Settings → Reset Data → Reset defaults**.

---

## Export Functionality

The export feature generates a file from the **currently filtered and sorted** transaction list — not the full dataset. This means you can filter to a specific category or date range and export only that subset.

### CSV Export
- Columns: Date, Description, Category, Amount, Type, Status
- Compatible with Microsoft Excel, Google Sheets, and any spreadsheet application
- If dates appear as `######` in Excel, double-click the column A border to auto-fit the width

### JSON Export
- Full structured array of transaction objects
- Useful for developers or for re-importing data

---

## Deployment

### Build for Production

```bash
npm run build
```

This generates an optimized `dist/` folder ready for deployment.

### Deploy to Vercel

```bash
# Push your code to GitHub first
git init
git add .
git commit -m "Initial commit — Zorvyn Finance Dashboard"
git remote add origin https://github.com/YOUR_USERNAME/zorvyn-assignment.git
git branch -M main
git push -u origin main
```

Then:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** and import your repository
3. Vercel automatically detects Vite — no configuration needed
4. Click **Deploy**
5. Your app goes live at a URL like `https://zorvyn-assignment-nu.vercel.app/`

To customize the URL, go to **Project Settings → Domains** in the Vercel dashboard.


## Author

**Venigalla Bhanusri**  
Frontend Developer Intern Applicant

*This project was built purely for evaluation purposes as part of a Frontend Developer Intern assignment. All financial data shown is mock/static and does not represent real transactions.*
