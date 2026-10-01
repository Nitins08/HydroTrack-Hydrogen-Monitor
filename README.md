# HydroTrack: Hydrogen Production, Cost and Sustainability Monitoring System

**HydroTrack** is a full-stack MERN (MongoDB, Express.js, React, Node.js) web dashboard built for monitoring, analyzing, and reporting on simulated operational metrics for a green hydrogen production plant. It tracks hydrogen output, consumption, operational costs in Indian Rupees (₹), energy split, carbon emissions, water consumption, an automated 100-point sustainability score, and role-based authentication.

---

## 🚀 Key Features

- **Authentication & Role-Based Access Control (RBAC)**:
  - JWT-based authentication with `bcryptjs` password hashing and localStorage session persistence.
  - Strict role-based permissions for **Admin** and **Operator** roles enforced on both client and server.
  - Dedicated `/login` and `/signup` pages with real-time validation and show/hide password toggles.
  - Protected API routes and client-side `ProtectedRoute` guards with role-based checks.
  - Header displays current user name and role badge (`ADMIN` or `OPERATOR`).
  - **Operator Restrictions**: Can view all monitoring pages, add new daily readings, and edit *only* readings they personally created. Cannot delete any readings, access the Admin Panel, or view user directories.
  - **Admin Privileges**: Can view and manage all readings (add, edit, and delete any reading) and access the **Admin Panel** (`/admin`) to view system metrics, toggle user roles, and delete operator accounts (with self-deletion protection).
- **Dashboard**:
  - Live key performance indicators: Hydrogen Produced, Hydrogen Consumed, Production Efficiency, and Operational Cost in Indian Rupees (₹).
  - Time-series interactive chart comparing daily production against consumption and target baseline with instant, non-sliding tooltips.
  - Alert panel triggering on operational deviations (Efficiency < 90%, Cost > ₹150/kg, Renewable Share < 60%).
  - Recent operational log table with role-aware action buttons (Edit own/all, Delete admin-only, View-only badges).
- **Analytics**:
  - Breakdown cards for Energy Consumption, Water Consumption, Total Operational Cost, and Average Cost per kg.
  - Dual-axis Production & Efficiency trends.
  - Unit Cost trendline with ₹150/kg threshold marker.
  - Operational Cost Breakdown and calculation methodology breakdown.
- **Sustainability**:
  - Transparent 100-point Sustainability Score:
    - **Renewable Energy Share (40 pts)**: Proportion of green vs. grid power.
    - **CO₂ Emissions Intensity (30 pts)**: Penalized for exceeding baseline carbon intensity.
    - **Water Use Efficiency (15 pts)**: Benchmarked against optimal electrolysis water usage (~9 L/kg H₂).
    - **Production Efficiency (15 pts)**: System output relative to nameplate target.
  - Clean vs. Grid energy composition and environmental rating badge.
- **Data Management (Full CRUD)**:
  - Add new simulated daily records with client- and server-side validation.
  - View historical readings in the Recent Daily Readings table.
  - Edit existing records with pre-filled values and instant metric recalculation.
  - Delete records safely via confirmation modal dialog (Admin only).
  - Duplicate date detection and positive numeric validation.

---

## 👥 Role-Based Access Control (RBAC) Matrix

| Feature / Action | Plant Operator | Administrator | Security Enforcement |
| :--- | :---: | :---: | :--- |
| **View Dashboard, Analytics & Sustainability** | ✅ Allowed | ✅ Allowed | JWT Authentication |
| **Add New Daily Reading** | ✅ Allowed | ✅ Allowed | Authenticated (`createdBy` auto-assigned) |
| **Edit Own Created Reading** | ✅ Allowed | ✅ Allowed | Verified `createdBy === req.user._id` |
| **Edit Other Users' Readings** | ❌ Blocked | ✅ Allowed | HTTP 403 Forbidden check on server |
| **Delete Daily Readings** | ❌ Blocked | ✅ Allowed | Admin-only check (`HTTP 403 Forbidden`) |
| **Access Admin Panel (`/admin`)** | ❌ Redirected to `/` | ✅ Allowed | Client guard + Server 403 Forbidden |
| **View All Registered Users** | ❌ Blocked | ✅ Allowed | `requireAdmin` middleware |
| **Change User Roles (`operator` ↔ `admin`)** | ❌ Blocked | ✅ Allowed | `requireAdmin` middleware |
| **Delete Operator Accounts** | ❌ Blocked | ✅ Allowed | Admin check + self-deletion blocked |
| **Delete Own Admin Account** | ❌ Blocked | ❌ Blocked | Prevented by server (`HTTP 400 Bad Request`) |

---

## 🛠️ Technology Stack

- **Frontend**: React 18 (Vite), Tailwind CSS, Lucide React (Icons), Recharts, Axios, React Router v6
- **Backend**: Node.js, Express.js, Mongoose (ODM), JWT (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv
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
│   │   ├── adminController.js    # User directory, role updates & account deletion
│   │   ├── analyticsController.js# Dashboard, Analytics & Sustainability aggregations
│   │   ├── authController.js     # Signup, login, and getMe endpoints
│   │   └── readingsController.js # Role-aware CRUD & validation for daily readings
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & requireAdmin guards
│   ├── models/
│   │   ├── DailyReading.js       # Schema with createdBy (User ref) & telemetry
│   │   └── User.js               # Schema for user accounts & roles (admin/operator)
│   ├── routes/
│   │   ├── adminRoutes.js        # /api/admin (Protected & Admin Only)
│   │   ├── analyticsRoutes.js    # /api/analytics (Protected)
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── dashboardRoutes.js    # /api/dashboard (Protected)
│   │   ├── readingsRoutes.js     # /api/readings (Protected)
│   │   └── sustainabilityRoutes.js# /api/sustainability (Protected)
│   ├── scripts/
│   │   └── seed.js               # Seeds demo Admin, Operator & 30-day sample dataset
│   ├── .env                      # PORT, MONGO_URI, and JWT_SECRET
│   ├── .env.example              # Template without sensitive credentials
│   ├── package.json
│   └── server.js                 # Express application entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddReadingModal.jsx # Entry form for new/edited records
│   │   │   ├── AlertPanel.jsx      # Alert badge & status panel
│   │   │   ├── ChartContainer.jsx  # Reusable card container for Recharts
│   │   │   ├── ChartTooltip.jsx    # Instant pop-in tooltip without sliding animation
│   │   │   ├── DeleteConfirmModal.jsx # Modal confirmation dialog for deletion
│   │   │   ├── ErrorState.jsx      # Graceful error display with retry
│   │   │   ├── KPICard.jsx         # Metric card with icons and trends
│   │   │   ├── LoadingState.jsx    # Smooth skeleton/spinner loader
│   │   │   ├── Navbar.jsx          # Header navigation, role-aware links & logout
│   │   │   └── ProtectedRoute.jsx  # Route guard supporting role authorization
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication provider and hook
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx       # Admin Panel: user directory, role control & deletion
│   │   │   ├── AnalyticsPage.jsx   # Energy, cost, and water analysis
│   │   │   ├── DashboardPage.jsx   # Core overview, role-aware CRUD table & alert monitoring
│   │   │   ├── LoginPage.jsx       # User login with show/hide password
│   │   │   ├── SignupPage.jsx      # Operator registration
│   │   │   └── SustainabilityPage.jsx # ESG breakdown & 100-pt scorecard
│   │   ├── services/
│   │   │   └── api.js              # Axios client with JWT interceptors & admin APIs
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
MONGO_URI=mongodb://localhost:27017/hydrotrack
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Seed Database (Demo Accounts & 30 Days Telemetry)
Populate the demo administrator account, demo plant operator account, and 30 days of simulated hydrogen production data:
```bash
npm run seed
```

> [!IMPORTANT]
> **Demo Account Credentials (For Academic Demonstration)**:
> 
> | Role | Email Address | Password | Permissions Summary |
> | :--- | :--- | :--- | :--- |
> | **Administrator** | `admin@hydrotrack.com` | `Admin@123` | Full access, Admin Panel, User management, Edit/Delete any reading |
> | **Plant Operator** | `operator@hydrotrack.com` | `Operator@123` | Monitoring, Add readings, Edit own readings only, No deletion, No Admin Panel |
> 
> *Note: These are pre-seeded accounts created for evaluation and college viva.*

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

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Registers a new operator account |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieves the currently logged-in user profile |

### Core Metrics & Telemetry (Protected)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard?period=7d|30d|all` | Authenticated | Returns KPIs, charts, alerts, and recent readings |
| `GET` | `/api/analytics?period=7d|30d|all` | Authenticated | Returns cost, energy, and unit economics trends |
| `GET` | `/api/sustainability?period=7d|30d|all` | Authenticated | Returns 100-pt scorecard and emissions breakdown |
| `GET` | `/api/readings?period=7d|30d|all` | Authenticated | Returns list of raw daily readings |
| `POST` | `/api/readings` | Authenticated | Adds a new daily record (records `createdBy: req.user._id`) |
| `PUT` | `/api/readings/:id` | Authenticated | Updates reading (Admin can update any; Operator only own) |
| `DELETE` | `/api/readings/:id` | **Admin Only** | Permanently deletes a reading (Returns 403 for operators) |

### Administrative User Management (Admin Only)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | **Admin Only** | Retrieves all registered users & account summary metrics |
| `PATCH` | `/api/admin/users/:id/role` | **Admin Only** | Updates a user's role (`operator` ↔ `admin`) |
| `DELETE` | `/api/admin/users/:id` | **Admin Only** | Deletes a user account (Prevents deleting own admin account) |

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

### 1. Demonstrating Operator View & Role Restrictions
1. Open `http://localhost:5173/login` in your browser.
2. Log in using the seeded operator credentials:
   - **Email**: `operator@hydrotrack.com`
   - **Password**: `Operator@123`
3. Observe:
   - Header shows **Plant Operator** with badge `OPERATOR`.
   - The navigation links show only `Dashboard`, `Analytics`, and `Sustainability`. Notice **Admin Panel is hidden**.
4. In the browser address bar, try navigating directly to `http://localhost:5173/admin`:
   - Notice that the route guard immediately intercepts and redirects back to `/`.
5. On the Dashboard:
   - Notice that **Delete** buttons are completely hidden in the Recent Daily Readings table.
   - For readings created by other users, the actions column displays a clean *View only* label.
   - For the latest reading (assigned to the Operator upon seed) or newly added readings, the **Edit** button is available and functional.
   - Click **"+ Add Reading"** to add a new daily reading. Notice that your new reading is successfully recorded with your account ID.

### 2. Demonstrating Admin View & User Management
1. Click **Logout** from the header.
2. Log in using the demo administrator credentials:
   - **Email**: `admin@hydrotrack.com`
   - **Password**: `Admin@123`
3. Observe:
   - Header shows **System Admin** with badge `ADMIN`.
   - The navigation bar now includes **Admin Panel**.
   - On the Dashboard, **Edit** and **Delete** buttons are visible on all rows.
4. Click **Admin Panel** in the top navigation bar:
   - Review the 3 KPI metric cards: **Total Accounts**, **Administrators**, and **Plant Operators**.
   - Review the **User Directory** table showing all registered users and their details.
   - Change an operator's role to `admin` using the dropdown selector, and observe the instant live update.
   - Test deleting an account: click **Delete** on an operator account to open the confirmation modal and remove it safely.
   - Notice that for the currently logged-in Admin account, role modification and account deletion are protected.

---

## 📄 License
This project is created for educational and academic demonstration purposes.
