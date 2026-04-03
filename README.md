# 🏠 Boarding Finder — Frontend

> A modern React web application that helps students find and compare boarding houses near universities across Sri Lanka.

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple?logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Context Providers](#context-providers)
- [Currency System](#currency-system)
- [Author](#author)

---

## About

The Boarding Finder frontend is a React SPA (Single Page Application) that lets students search, filter, compare, and favourite boarding houses. It includes an AI-powered listing writer, interactive map-based location picker, multi-currency price display, dark mode, and a full admin dashboard.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP requests to backend API |
| Leaflet + React Leaflet | Interactive maps |
| Bootstrap 5 | Base layout grid |
| React Icons | Icon library |

---

## Features

- 🔍 **Search & Filter** — Filter by keyword, location, price range, and room type
- 🗺️ **Map View** — Browse listings on an interactive Leaflet map
- 📊 **Compare** — Side-by-side comparison of multiple boarding listings
- ❤️ **Favourites** — Save and manage favourite listings (logged-in users)
- 📩 **Inquiries** — Send visit requests directly to listing owners
- ⭐ **Ratings & Reviews** — Rate and review boarding places
- 🤖 **AI Listing Writer** — Generate and improve listing descriptions with Claude AI
- 📍 **Map Location Picker** — Click on a map to set exact listing location (no manual lat/lng entry)
- 💱 **Multi-Currency** — Display prices in 10 currencies (LKR, USD, EUR, GBP, AUD, INR, SGD, JPY, CAD, AED)
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 👤 **Profile Management** — Update name, email, password, and profile photo
- 👮 **Admin Dashboard** — Manage users, ban/unban accounts, promote admins, manage listings

---

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with base URL + auth token interceptor
├── components/
│   ├── Navbar.jsx             # Top navigation with currency selector and dark mode toggle
│   ├── Footer.jsx             # Site footer
│   ├── ProtectedRoute.jsx     # Redirect unauthenticated users to login
│   ├── AdminRoute.jsx         # Redirect non-admins away from admin pages
│   ├── StarRating.jsx         # Interactive star rating component
│   ├── AIReviewAssistant.jsx  # AI-powered review summary component
│   └── ConfirmModal.jsx       # Reusable confirmation dialog
├── context/
│   ├── AuthContext.jsx        # User auth state (login, logout, updateUser)
│   ├── ThemeContext.jsx       # Dark/light mode state
│   └── CurrencyContext.jsx    # Currency selection + price conversion (10 currencies)
├── pages/
│   ├── Home.jsx               # Listings grid with search and filters
│   ├── BoardingDetail.jsx     # Single listing detail page
│   ├── AddBoarding.jsx        # Create new listing with AI writer + map picker
│   ├── EditBoarding.jsx       # Edit existing listing
│   ├── Favorites.jsx          # Saved listings
│   ├── MapPage.jsx            # Full map view of all listings
│   ├── ComparePage.jsx        # Side-by-side listing comparison
│   ├── InquiriesPage.jsx      # Inquiries received on your listings
│   ├── MyInquiriesPage.jsx    # Inquiries you sent
│   ├── Profile.jsx            # User profile + avatar management
│   ├── Login.jsx              # Login page
│   ├── Register.jsx           # Registration page
│   ├── ForgotPassword.jsx     # Password reset request
│   ├── ResetPassword.jsx      # Password reset form
│   ├── AdminLogin.jsx         # Admin login
│   ├── AdminDashboard.jsx     # Admin stats overview
│   ├── AdminUsers.jsx         # Manage users (ban, promote, delete)
│   ├── AdminUserDetail.jsx    # Individual user detail for admin
│   └── AdminBoardings.jsx     # Manage all listings as admin
├── App.jsx                    # Route definitions and provider tree
├── main.jsx                   # React entry point
└── index.css                  # Global styles and CSS variables
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running at `http://localhost:5001` (see backend README)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ravindu200324511398/boarding-finder.git
cd boarding-finder/boarding-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will run at: `http://localhost:3000`

> Make sure the backend server is running before starting the frontend.

---

## Environment Variables

The frontend uses a proxy in development. The `vite.config.js` proxies `/api` requests to `http://localhost:5001` automatically, so no `.env` is needed for development.

If deploying to production, update the base URL in `src/api/axios.js`:

```js
const api = axios.create({
  baseURL: 'https://your-production-api.com/api',
});
```

---

## Pages & Routes

| Path | Page | Auth Required |
|---|---|---|
| `/` | Home — listing grid with search | ❌ |
| `/boarding/:id` | Boarding detail page | ❌ |
| `/map` | Map view of all listings | ❌ |
| `/compare` | Side-by-side comparison | ❌ |
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/forgot-password` | Forgot password | ❌ |
| `/reset-password/:token` | Reset password | ❌ |
| `/add` | Add new boarding listing | ✅ |
| `/edit/:id` | Edit boarding listing | ✅ |
| `/favorites` | Saved favourites | ✅ |
| `/inquiries` | Inquiries on your listings | ✅ |
| `/my-inquiries` | Inquiries you sent | ✅ |
| `/profile` | User profile | ✅ |
| `/admin` | Admin login | ❌ |
| `/admin/dashboard` | Admin dashboard | 👮 Admin |
| `/admin/users` | Manage users | 👮 Admin |
| `/admin/users/:id` | User detail | 👮 Admin |
| `/admin/boardings` | Manage all listings | 👮 Admin |

---

## Context Providers

The app wraps everything in three context providers (in `App.jsx`):

```jsx
<ThemeProvider>        // dark/light mode
  <AuthProvider>       // user login state + token
    <CurrencyProvider> // selected currency + conversion
      <Router>
        ...
      </Router>
    </CurrencyProvider>
  </AuthProvider>
</ThemeProvider>
```

### AuthContext

```js
const { user, token, isAuth, login, logout, updateUser } = useAuth();
```

### ThemeContext

```js
const { isDark, toggleTheme } = useTheme();
```

### CurrencyContext

```js
const { currency, changeCurrency, format, convert, currencies } = useCurrency();
```

---

## Currency System

Prices are stored in **LKR (Sri Lankan Rupee)** in the database. The currency selector in the navbar converts all displayed prices client-side.

### Supported Currencies

| Flag | Code | Currency |
|---|---|---|
| 🇱🇰 | LKR | Sri Lankan Rupee (default) |
| 🇺🇸 | USD | US Dollar |
| 🇪🇺 | EUR | Euro |
| 🇬🇧 | GBP | British Pound |
| 🇦🇺 | AUD | Australian Dollar |
| 🇮🇳 | INR | Indian Rupee |
| 🇸🇬 | SGD | Singapore Dollar |
| 🇯🇵 | JPY | Japanese Yen |
| 🇨🇦 | CAD | Canadian Dollar |
| 🇦🇪 | AED | UAE Dirham |

### Usage in any component

```jsx
import { useCurrency } from '../context/CurrencyContext';

const { format } = useCurrency();

// Displays price in the selected currency automatically
<span>{format(boarding.price)}/mo</span>
```

The selected currency is saved to `localStorage` so it persists across sessions.

---

## Map Location Picker

When adding or editing a boarding listing, instead of typing latitude and longitude manually, users can:

1. See a full Sri Lanka map
2. Click anywhere to drop a pin
3. Coordinates are set automatically
4. Optionally type coordinates directly if known

Built with **React Leaflet** — no Google Maps API key required.

---

## AI Listing Writer

Powered by **Claude (Anthropic)** via the backend `/api/ai` routes:

- **Generate** — fills in the title and description automatically based on location, price, room type, and amenities
- **Improve** — rewrites an existing description to be more professional and appealing

---

## Admin Dashboard

Accessible at `/admin/dashboard` for admin accounts only. Features:

- 📊 Stats — total users, listings, average price, listings by room type
- 👤 User management — view all users, ban/unban, promote to admin, delete accounts
- 🏠 Listing management — view and delete any listing on the platform

---

## Author

**Ravindu Saranga**
- GitHub: [@Ravindu200324511398](https://github.com/Ravindu200324511398)

---

## License

This project is licensed under the MIT License.
