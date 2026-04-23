# Compostify — Changes & Fixes

## Bug Fixes

### 🐛 Bug 1: `bookings.js` — Dead route (Critical)
`PATCH /api/bookings/:id/status` was defined **after** `module.exports = router`,
so it was never registered. Updating booking status and sending email notifications
were completely broken. Fixed by moving `module.exports` to the end of the file.

### 🐛 Bug 2: Missing OTP fields on User model
`User.js` had no `otp`, `otpExpiry`, or `otpVerified` fields.
These are now added to support the new 2-step login flow.

---

## New Features

### 🔐 OTP Verification on Login
Two-step login flow:
1. User submits email + password → backend validates and sends a 6-digit OTP to email
2. User enters OTP → backend verifies it and issues the JWT token

**New backend endpoints:**
- `POST /api/auth/verify-otp` — verifies the OTP and returns JWT
- `POST /api/auth/resend-otp` — generates and sends a fresh OTP

**Frontend (login.html):**
- Step 1 screen: email + password form
- Step 2 screen: OTP entry with 10-minute countdown timer
- Resend OTP button with 60-second cooldown
- "Back" button to return to credentials step
- Input restricted to digits only

OTPs expire after 10 minutes and are cleared after use.
In development, OTPs are printed to the server console via the simulated mailer.

### 🌿 6 New Composting Service Types
| Type | Description |
|---|---|
| `vermicomposting` | Worm farm setup & support |
| `community_composting` | Neighbourhood hub management |
| `garden_soil_supply` | Compost-enriched soil delivery |
| `compost_bin_rental` | Bin/tumbler monthly rental |
| `workshop_training` | Group composting workshops |
| `waste_audit` | Organic waste audit & report |

Updated in: `Service.js` model, `services.html` filter dropdown, `services.html` typeMap.

### 📦 Expanded Seed Data (`scripts/seed.js`)
- Clears existing users and services before seeding
- Creates 1 admin + 3 verified expert users
- Creates 10 sample services (one per service type)
- Run with: `node scripts/seed.js`

---

## Files Changed
| File | Change |
|---|---|
| `backend/models/User.js` | Added `otp`, `otpExpiry`, `otpVerified` fields |
| `backend/models/Service.js` | Expanded `serviceType` enum with 6 new types |
| `backend/routes/auth.js` | Full OTP flow: login sends OTP, verify-otp, resend-otp endpoints |
| `backend/routes/bookings.js` | **Bug fix** — `module.exports` moved to end of file |
| `backend/scripts/seed.js` | 3 experts + 10 services (all service types) |
| `frontend/js/api.js` | Added `verifyOtp` and `resendOtp` API methods |
| `frontend/login.html` | 2-step OTP UI with timer, resend, and back button |
| `frontend/services.html` | Filter dropdown + typeMap updated with 6 new service types |

---

## Running the Project

```bash
# Backend
cd Project/backend
npm install
node scripts/seed.js   # optional: seed demo data
npm start              # runs on http://localhost:5000

# Frontend
# Open Project/frontend/index.html in a browser
# or serve with: npx serve Project/frontend
```

Admin login: `admin@compostify.com` / `admin123`
Expert login: `priya@compostify.com` / `expert123`

> OTPs are printed to the server console in development mode.
