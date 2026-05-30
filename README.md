# 🏦 Loan Management System (LMS)

> A full-stack lending platform built with **MERN + Next.js + TypeScript**
> 
> Borrowers apply for loans through a guided multi-step portal. Internal executives manage the full loan lifecycle through a role-based operations dashboard.

---

## 📺 Demo Video
<!-- Replace this link after recording -->
> 🎬 [Watch Demo on YouTube (unlisted)](https://youtube.com/your-demo-link)

---

## 🔑 Login Credentials

> Run `npm run seed` in the `/backend` folder first to create these accounts.

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | admin@lms.com | Admin@123 |
| 👥 Sales | sales@lms.com | Sales@123 |
| ✅ Sanction | sanction@lms.com | Sanction@123 |
| 💸 Disbursement | disburse@lms.com | Disburse@123 |
| 💰 Collection | collection@lms.com | Collection@123 |
| 👤 Borrower | borrower@lms.com | Borrower@123 |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| File Upload | Multer (PDF/JPG/PNG, max 5MB) |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas (DB) |

---

## 🗂️ Project Structure

```
lms-project/
├── backend/                    ← Express + TypeScript API
│   ├── src/
│   │   ├── config/db.ts        ← MongoDB connection
│   │   ├── models/             ← User, LoanApplication, Payment
│   │   ├── middleware/         ← JWT auth + RBAC
│   │   ├── routes/             ← All API route definitions
│   │   ├── controllers/        ← Business logic per module
│   │   ├── utils/
│   │   │   ├── bre.ts          ← Business Rule Engine
│   │   │   └── loanCalculator.ts
│   │   ├── seed.ts             ← Creates test accounts
│   │   └── index.ts            ← Express app entry point
│   ├── uploads/                ← Uploaded salary slips (gitignored)
│   ├── .env.example
│   └── package.json
│
├── frontend/                   ← Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         ← Login + Signup (route group)
│   │   │   ├── apply/          ← Borrower multi-step flow
│   │   │   │   ├── personal/   ← Step 2: Details + BRE
│   │   │   │   ├── upload/     ← Step 3: Salary slip
│   │   │   │   ├── configure/  ← Step 4: Loan sliders + SI calc
│   │   │   │   └── status/     ← Loan status tracker
│   │   │   └── dashboard/      ← Operations dashboard
│   │   │       ├── sales/
│   │   │       ├── sanction/
│   │   │       ├── disbursement/
│   │   │       └── collection/
│   │   ├── lib/
│   │   │   ├── api.ts          ← Axios instance + interceptors
│   │   │   └── auth.ts         ← Token helpers
│   │   ├── middleware.ts        ← Next.js route guard (RBAC)
│   │   └── types/index.ts      ← Shared TypeScript types
│   ├── .env.example
│   └── package.json
│
├── .github/workflows/ci.yml    ← GitHub Actions CI
├── render.yaml                 ← Render backend deployment
├── README.md
└── .gitignore
```

---

## 🚀 Local Setup (Step-by-Step)

### Prerequisites
- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **MongoDB** running locally → [mongodb.com](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/atlas) (free)
- **Git** → [git-scm.com](https://git-scm.com)
- **npm** (comes with Node)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/lms-project.git
cd lms-project
```

---

### Step 2 — Backend Setup

```bash
cd backend
```

**Install dependencies:**
```bash
npm install
```

**Create your environment file:**
```bash
cp .env.example .env
```

**Edit `.env` with your values:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lms_db
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
CLIENT_URL=http://localhost:3000
```

> 💡 If using MongoDB Atlas, your `MONGO_URI` looks like:
> `mongodb+srv://username:password@cluster.mongodb.net/lms_db?retryWrites=true&w=majority`

**Seed the database (creates all test accounts):**
```bash
npm run seed
```

Expected output:
```
✅ MongoDB Connected: localhost
🌱 Seeding database...

Role            Email                          Password
────────────────────────────────────────────────────────────
admin           admin@lms.com                  Admin@123
sales           sales@lms.com                  Sales@123
sanction        sanction@lms.com               Sanction@123
disbursement    disburse@lms.com               Disburse@123
collection      collection@lms.com             Collection@123
borrower        borrower@lms.com               Borrower@123

🎉 Seed complete!
```

**Start the backend dev server:**
```bash
npm run dev
```

Backend runs on → **http://localhost:5000**
Health check → **http://localhost:5000/health**

---

### Step 3 — Frontend Setup

Open a **new terminal tab/window**:

```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Create your environment file:**
```bash
cp .env.example .env.local
```

**Edit `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Start the frontend dev server:**
```bash
npm run dev
```

Frontend runs on → **http://localhost:3000**

---

### Step 4 — Open the App

| URL | What it is |
|-----|-----------|
| http://localhost:3000 | App (redirects to login) |
| http://localhost:3000/login | Login page |
| http://localhost:3000/signup | Borrower registration |
| http://localhost:3000/apply/personal | Borrower application flow |
| http://localhost:3000/dashboard | Operations dashboard |
| http://localhost:5000/health | Backend health check |

---

## 🔄 Complete User Flows

### Borrower Flow (End-to-End)

```
1. Go to /signup → Register (creates borrower account)
2. Redirected to /apply/personal
3. Fill personal details → BRE runs on server
   - Age must be 23–50
   - Monthly salary ≥ ₹25,000
   - PAN must match format: ABCDE1234F
   - Must not be unemployed
4. Upload salary slip (PDF/JPG/PNG, max 5MB)
5. Use sliders to pick loan amount (₹50K–₹5L) & tenure (30–365 days)
   - Live SI calculation updates in real-time
   - SI = (P × R × T) / (365 × 100) where R = 12% p.a.
6. Click "Apply" → loan created with status: applied
7. Check /apply/status to track the loan
```

### Operations Flow (Executive Dashboard)

```
Sales:        /dashboard/sales        → See borrowers who haven't applied
Sanction:     /dashboard/sanction     → Approve or Reject (with reason) applied loans
Disbursement: /dashboard/disbursement → Release funds for sanctioned loans
Collection:   /dashboard/collection   → Record repayment payments
                                         • UTR must be globally unique
                                         • Amount cannot exceed outstanding balance
                                         • Loan auto-closes when fully paid
Admin:        All of the above        → Full visibility
```

### Loan Status Transitions

```
APPLIED  →  SANCTIONED  →  DISBURSED  →  CLOSED
   ↓
REJECTED (from sanction, with reason)
```

---

## 📐 Business Rule Engine (BRE)

The BRE is enforced **server-side** (in `backend/src/utils/bre.ts`). The client shows live hints, but the server is authoritative.

| Rule | Condition | Rejection Message |
|------|-----------|------------------|
| Age | Must be 23–50 years | "Age must be between 23 and 50 years" |
| Salary | ≥ ₹25,000/month | "Monthly salary must be at least ₹25,000" |
| PAN | Regex: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` | "PAN number is invalid" |
| Employment | Not unemployed | "Unemployed applicants are not eligible" |

> **Why server-side?** Client-side checks can be bypassed by modifying JavaScript or sending raw API requests. The server is always the single source of truth.

---

## 💰 Loan Interest Calculation

```
Formula: SI = (P × R × T) / (365 × 100)

Where:
  P = Principal (loan amount in ₹)
  R = Rate = 12 (fixed 12% per annum)
  T = Tenure in days

Total Repayment = P + SI
```

**Example:**
- Principal: ₹2,00,000
- Tenure: 180 days
- SI = (2,00,000 × 12 × 180) / (365 × 100) = ₹11,835.62
- Total Repayment = ₹2,11,835.62

---

## 🛡️ Role-Based Access Control (RBAC)

Access is enforced at **two layers**:

**1. Frontend (Next.js Middleware — `src/middleware.ts`):**
- Reads role from cookie set at login
- Redirects unauthenticated users to `/login`
- Redirects borrowers away from `/dashboard`
- Redirects dashboard roles away from `/apply`
- Redirects executives to their own module only (admin sees all)

**2. Backend (Express RBAC Middleware — `src/middleware/rbac.ts`):**
- Every protected route requires valid JWT
- `authorize(...roles)` middleware checks the user's role
- Returns `403 Forbidden` if the role doesn't match
- Hiding a UI element is NOT enough — the API enforces it too

```
Route                         Allowed Roles
────────────────────────────────────────────────
POST /api/borrower/*          borrower
GET  /api/sales/*             sales, admin
GET  /api/sanction/*          sanction, admin
GET  /api/disbursement/*      disbursement, admin
GET  /api/collection/*        collection, admin
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/signup` | No | `{name, email, password}` | `{token, user}` |
| POST | `/api/auth/login` | No | `{email, password}` | `{token, user}` |
| GET | `/api/auth/me` | JWT | — | `{user}` |

### Borrower
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| POST | `/api/borrower/personal-details` | JWT (borrower) | Runs BRE, returns 422 on fail |
| POST | `/api/borrower/upload-salary-slip` | JWT (borrower) | multipart/form-data, field: `salarySlip` |
| POST | `/api/borrower/configure-loan` | JWT (borrower) | `{loanAmount, tenure}` |
| GET | `/api/borrower/loan-status` | JWT (borrower) | Returns latest application |

### Sales
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/sales/leads` | JWT (sales/admin) | Borrowers with no application |
| GET | `/api/sales/summary` | JWT (sales/admin) | Counts for dashboard |

### Sanction
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/sanction/applications` | JWT (sanction/admin) | All `applied` loans |
| PATCH | `/api/sanction/:id/sanction` | JWT (sanction/admin) | Approve → `sanctioned` |
| PATCH | `/api/sanction/:id/reject` | JWT (sanction/admin) | Body: `{reason}` → `rejected` |

### Disbursement
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/disbursement/loans` | JWT (disbursement/admin) | All `sanctioned` loans |
| PATCH | `/api/disbursement/:id/disburse` | JWT (disbursement/admin) | → `disbursed` |

### Collection
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/collection/loans` | JWT (collection/admin) | `disbursed` + `closed` loans |
| POST | `/api/collection/:id/payment` | JWT (collection/admin) | `{utrNumber, amount, paymentDate}` |
| GET | `/api/collection/:id/payments` | JWT (collection/admin) | All payments for a loan |

---

## 🗄️ MongoDB Collections

### `users`
```
_id, name, email, password (hashed), role, createdAt, updatedAt
```

### `loanapplications`
```
_id, borrower (ref), fullName, pan, dateOfBirth, monthlySalary,
employmentMode, salarySlipUrl, salarySlipFileName,
loanAmount, tenure, interestRate, simpleInterest, totalRepayment,
status, rejectionReason, totalPaid,
appliedAt, sanctionedAt, disbursedAt, closedAt,
sanctionedBy (ref), disbursedBy (ref),
createdAt, updatedAt
```

### `payments`
```
_id, loan (ref), borrower (ref), utrNumber (unique),
amount, paymentDate, recordedBy (ref), createdAt, updatedAt
```

---

## ☁️ Deployment Guide

### 1. MongoDB Atlas (Free Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → **Create free account**
2. Create a **Free Shared Cluster** (M0)
3. Under **Database Access** → Add user with password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<password>` with your DB user password
7. Save this as your `MONGO_URI`

---

### 2. Backend → Render (Free Hosting)

1. Push your code to GitHub (see Git section below)
2. Go to [render.com](https://render.com) → Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repo → Select it
5. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `lms-backend` |
| **Region** | Singapore (closest to India) |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node dist/index.js` |
| **Plan** | Free |

6. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string (min 32 chars) |
| `CLIENT_URL` | Your Vercel URL (add after deploying frontend) |
| `NODE_ENV` | `production` |

7. Click **Create Web Service** → Wait for deploy
8. Your backend URL: `https://lms-backend-xxxx.onrender.com`
9. Test it: visit `https://lms-backend-xxxx.onrender.com/health`

> ⚠️ Free Render instances **spin down after 15 min of inactivity**. First request after sleep takes ~30 sec. Use [UptimeRobot](https://uptimerobot.com) (free) to ping `/health` every 5 min to keep it awake.

**After backend is live — run the seed:**
```bash
# In your backend folder, update .env with Atlas URI, then:
MONGO_URI="mongodb+srv://..." npm run seed
```

---

### 3. Frontend → Vercel (Free Hosting)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Next.js (auto-detected) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |

5. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://lms-backend-xxxx.onrender.com/api` |

6. Click **Deploy** → Wait 2–3 minutes
7. Your frontend URL: `https://lms-project-xxxx.vercel.app`

8. **Go back to Render** → Update `CLIENT_URL` env var to your Vercel URL → **Redeploy**

---

### 4. Connect Frontend ↔ Backend

After both are deployed:

- Render backend `CLIENT_URL` = `https://your-app.vercel.app`
- Vercel frontend `NEXT_PUBLIC_API_URL` = `https://lms-backend-xxxx.onrender.com/api`

Trigger a re-deploy on both after updating env vars.

---

## 🐙 Git & GitHub — Complete Setup

### Step 1 — Initialize Git in Project Root

```bash
cd lms-project
git init
git add .
git commit -m "feat: initial commit — LMS full-stack project"
```

### Step 2 — Create GitHub Repository

1. Go to [github.com](https://github.com) → Click **+** → **New repository**
2. Repository name: `lms-project`
3. Set to **Public** (or Private, then add evaluator as collaborator)
4. **Do NOT** initialize with README (we already have one)
5. Click **Create repository**

### Step 3 — Push to GitHub

Copy the commands GitHub shows you, or use:

```bash
git remote add origin https://github.com/YOUR_USERNAME/lms-project.git
git branch -M main
git push -u origin main
```

### Step 4 — Verify on GitHub

Visit `https://github.com/YOUR_USERNAME/lms-project` — you should see all files.

### Step 5 — Add Evaluator as Collaborator (if private repo)

1. Go to repo → **Settings** → **Collaborators**
2. Click **Add people** → Enter evaluator's GitHub username
3. They'll receive an email invitation

---

## 📁 What to .gitignore (Already Configured)

The root `.gitignore` excludes:
- `node_modules/` — dependencies (install with `npm install`)
- `.env` and `.env.local` — secrets (evaluator sets their own)
- `dist/` — TypeScript build output
- `.next/` — Next.js build output
- `backend/uploads/*` — user-uploaded files (except `.gitkeep`)
- `.DS_Store`, `.idea/` — OS/editor files

> ✅ The `.env.example` files ARE committed — they tell evaluators what env vars to set.

---

## 🔁 Day-to-Day Git Workflow

```bash
# After making changes:
git add .
git commit -m "fix: loan calculator edge case"
git push

# To create a feature branch:
git checkout -b feature/payment-history
# ... make changes ...
git add .
git commit -m "feat: add payment history panel"
git push origin feature/payment-history
# Then open a Pull Request on GitHub
```

---

## 🧪 Testing the Complete Flow

Follow these steps to test everything end-to-end:

### Test 1: BRE Rejection
1. Login as `borrower@lms.com`
2. On personal details, enter: Age = 20, Salary = ₹10,000, PAN = `INVALID`
3. Click Continue → Should show 3 BRE errors

### Test 2: Successful Borrower Flow
1. Login as `borrower@lms.com`
2. Enter: Name = John Doe, PAN = `ABCDE1234F`, DOB = 1990-01-01, Salary = ₹50,000, Employment = Salaried
3. Upload any PDF/JPG/PNG file under 5MB
4. Set loan amount = ₹2,00,000, Tenure = 180 days
5. Verify: SI ≈ ₹11,835, Total ≈ ₹2,11,835
6. Click Apply

### Test 3: Sanction Flow
1. Login as `sanction@lms.com`
2. Go to `/dashboard/sanction`
3. See the application → Click Approve (or Reject with reason)

### Test 4: Disbursement Flow
1. Login as `disburse@lms.com`
2. Go to `/dashboard/disbursement`
3. Click Disburse → Confirm

### Test 5: Collection & Auto-Close
1. Login as `collection@lms.com`
2. Go to `/dashboard/collection`
3. Click Record on the disbursed loan
4. Enter UTR = `UTR001`, Amount = full outstanding, Date = today
5. Loan should auto-close

### Test 6: Admin Access
1. Login as `admin@lms.com`
2. Verify all 4 modules are visible in sidebar
3. Verify you can approve, disburse, record payments

### Test 7: RBAC Enforcement
1. Login as `sales@lms.com`
2. Try visiting `/dashboard/sanction` directly
3. Should be redirected to `/dashboard`
4. Try calling `PATCH /api/sanction/:id/sanction` with sales token → 403

---

## 📊 Evaluation Criteria

| Area | Weight | What's Covered |
|------|--------|---------------|
| End-to-end working flow | 35% | Complete borrower + all 4 executive flows |
| Code quality + TypeScript | 20% | Strict types, no `any`, clean structure |
| Correct BRE + loan math | 15% | Server-side BRE, SI formula with validation |
| RBAC (frontend + backend) | 15% | Middleware.ts + rbac.ts on every route |
| UI/UX + responsiveness | 10% | Tailwind, responsive tables, modals |
| README + repo hygiene | 5% | This README + clean .gitignore |

---

## 🐞 Troubleshooting

**MongoDB connection error:**
```bash
# Make sure MongoDB is running locally:
mongod --dbpath /data/db
# OR use MongoDB Atlas connection string in .env
```

**CORS errors in browser:**
- Make sure `CLIENT_URL` in backend `.env` matches exactly (no trailing slash)
- Example: `CLIENT_URL=http://localhost:3000`

**JWT errors:**
- Make sure `JWT_SECRET` is the same value across restarts
- Tokens are valid for 7 days

**Uploads not working locally:**
- Make sure the `backend/uploads/` directory exists
- The server creates it automatically on first run

**Next.js middleware not redirecting:**
- Make sure cookies are being set on login (check `lib/auth.ts` → `setAuth`)
- Open DevTools → Application → Cookies → check `lms_token` and `lms_role`

**Render free tier slow:**
- First request after cold start takes 30–60 seconds
- Use [UptimeRobot](https://uptimerobot.com) free plan to ping `/health` every 5 min

---

## 📝 Environment Variables Reference

### Backend (`backend/.env`)

```env
PORT=5000                              # Server port
MONGO_URI=mongodb://localhost:27017/lms_db   # MongoDB connection
JWT_SECRET=your_long_random_secret_here      # JWT signing key (keep secret!)
CLIENT_URL=http://localhost:3000             # Allowed CORS origin
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Backend API base URL
```

---

## 👨‍💻 Author

Built as a Full-Stack Assignment By Rishabh Agnihotri — MERN + Next.js + TypeScript

> **Stack**: Node.js · Express · MongoDB · Mongoose · Next.js 14 · TypeScript · Tailwind CSS · JWT · Multer
