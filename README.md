# HydroTrack: Hydrogen Production, Cost and Sustainability Monitoring System

**HydroTrack** is a full-stack MERN (MongoDB, Express.js, React, Node.js) web dashboard built for monitoring, analyzing, and reporting on simulated operational metrics for a green hydrogen production plant. It tracks hydrogen output, consumption, operational costs in Indian Rupees (₹), energy split, carbon emissions, water consumption, and an automated 100-point sustainability score.

---

## 🚀 Key Features

- **Dashboard**:
  - Live key performance indicators: Hydrogen Produced, Hydrogen Consumed, Production Efficiency, and Operational Cost in Indian Rupees (₹).
  - Time-series interactive chart comparing daily production against consumption and target baseline.
  - Alert panel triggering on operational deviations (Efficiency < 90%, Cost > ₹150/kg, Renewable Share < 60%).
  - Recent operational log table with status badges.
- **Analytics**:
  - Breakdown cards for Energy Consumption, Water Consumption, Total Operational Cost, and Average Cost per kg.
  - Dual-axis Production & Efficiency trends.
  - Unit Cost trendline with ₹150/kg threshold marker.
  - Energy Source split (Renewable Solar/Wind vs. Grid Power).
  - Water Consumption per kg of H₂ produced over time.
- **Sustainability**:
  - Transparent 100-point Sustainability Score:
    - **Renewable Energy Share (40 pts)**: Proportion of green vs. grid power.
    - **CO₂ Emissions Intensity (30 pts)**: Penalized for exceeding baseline carbon intensity.
    - **Water Use Efficiency (15 pts)**: Benchmarked against optimal electrolysis water usage (~9 L/kg H₂).
    - **Production Efficiency (15 pts)**: System output relative to nameplate target.
  - CO₂ emission trend (kg CO₂/day & kg CO₂/kg H₂).
  - Clean vs. Grid energy composition and environmental rating badge.
- **Data Management**:
  - Modal dialog to add simulated daily readings with client- and server-side validation.
  - Duplicate date detection and positive numeric validation.
  - Automatic re-calculation of efficiency, costs, and sustainability scores.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Vite), Tailwind CSS, Lucide React (Icons), Recharts, Axios, React Router v6
- **Backend**: Node.js, Express.js, Mongoose (ODM), CORS, Dotenv
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Language**: JavaScript (ES6+) throughout (Zero Python/FastAPI/SQLite dependencies)

---

## 📁 Project Structure

```text
HydroTrack/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── analyticsController.js# Dashboard, Analytics & Sustainability aggregations
│   │   └── readingsController.js # CRUD & validation for daily readings
│   ├── models/
│   │   └── DailyReading.js       # Mongoose schema for simulated daily readings
│   ├── routes/
│   │   ├── analyticsRoutes.js    # /api/analytics
│   │   ├── dashboardRoutes.js    # /api/dashboard
│   │   ├── readingsRoutes.js     # /api/readings
│   │   └── sustainabilityRoutes.js# /api/sustainability
│   ├── scripts/
│   │   └── seed.js               # 30-day realistic sample dataset generator
│   ├── .env                      # Port & MongoDB URI config
│   ├── package.json
│   └── server.js                 # Express application entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddReadingModal.jsx # Entry form for new daily records
│   │   │   ├── AlertPanel.jsx      # Alert badge & status panel
│   │   │   ├── ChartContainer.jsx  # Reusable card container for Recharts
│   │   │   ├── ErrorState.jsx      # Graceful error display with retry
│   │   │   ├── KPICard.jsx         # Metric card with icons and trends
│   │   │   ├── LoadingState.jsx    # Smooth skeleton/spinner loader
│   │   │   └── Navbar.jsx          # Header navigation & quick-action modal trigger
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx   # Energy, cost, and water analysis
│   │   │   ├── DashboardPage.jsx   # Core overview & alert monitoring
│   │   │   └── SustainabilityPage.jsx # ESG breakdown & 100-pt scorecard
│   │   ├── services/
│   │   │   └── api.js              # Axios service endpoints
│   │   ├── utils/
│   │   │   └── formatters.js       # Currency (₹), number, and date formatters
│   │   ├── App.jsx                 # Route definitions & global modal state
│   │   ├── index.css               # Tailwind CSS declarations
│   │   └── main.jsx                # React DOM root
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js              # Vite server & API proxy (/api -> :5000)
└── README.md
```

---

## ⚙️ Prerequisites

1. **Node.js** (v18.x or higher) & **npm**
2. **MongoDB** installed locally and running on port `27017`, or a **MongoDB Atlas** cloud connection string.

---

## 📦 Setup & Installation

### 1. Clone or Open Project
```bash
cd c:/MyNewProject
```

### 2. Backend Setup
Navigate to the `backend` directory, install dependencies, and configure environment variables:
```bash
cd backend
npm install
```

Create or verify `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hydrotrack
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string).*

### 3. Seed Database with Realistic Data
Populate 30 days of simulated hydrogen production data:
```bash
npm run seed
```
You should see: `Seeded 30 simulated daily readings into MongoDB successfully!`

### 4. Start Backend Server
```bash
npm start
# Server will run at http://localhost:5000
```

### 5. Frontend Setup
In a new terminal window:
```bash
cd ../frontend
npm install
npm run dev
# Frontend will be accessible at http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard?period=7d|30d|all` | Returns KPIs, production charts, alerts, and recent readings |
| `GET` | `/api/analytics?period=7d|30d|all` | Returns cost, energy, water, and unit economics trends |
| `GET` | `/api/sustainability?period=7d|30d|all` | Returns 100-pt score, component breakdown, and emissions data |
| `GET` | `/api/readings` | Returns list of all raw daily readings sorted by date descending |
| `POST` | `/api/readings` | Adds a new daily record (validates positive numbers & date uniqueness) |

---

## 🧮 KPI & Sustainability Calculation Rules

1. **Production Efficiency (%)**:
   Efficiency = (Hydrogen Produced / Target Production) * 100
2. **Cost per kg (₹/kg)**:
   Cost/kg = Total Operational Cost (₹) / Hydrogen Produced (kg)
3. **Alert Triggers**:
   - Low Efficiency: Efficiency < 90%
   - High Unit Cost: Cost/kg > ₹150
   - Low Green Energy Share: Renewable Energy % < 60%
4. **100-Point Sustainability Score**:
   - Renewable Energy (Max 40 pts): Renewable Energy % * 0.4
   - CO2 Mitigation (Max 30 pts): Benchmarked against zero-carbon baseline
   - Water Efficiency (Max 15 pts): Benchmarked against optimal ratio of 9 L/kg H2
   - Operational Efficiency (Max 15 pts): Benchmarked against 100% target production

---

## 💡 Demonstration & Viva Guide

- **Dashboard**: Use the period selector (7 Days / 30 Days / All) to show dynamic aggregation. Explain the alerts triggered on specific simulated operational dips.
- **Add Daily Reading**: Click **"+ Add Reading"** in the top right navbar. Enter a sample reading (e.g., date, production, cost in ₹). Demonstrate that it updates the dashboard in real time.
- **Analytics**: Point out the unit cost threshold line (₹150/kg) and the breakdown of grid vs. renewable energy.
- **Sustainability**: Explain how the 100-point score is calculated mathematically from actual operational data rather than hardcoded scores.

---

## 📄 License
This project is created for educational and academic demonstration purposes.
