# 🏠 Boarding Finder — Frontend (React)

## Tech Stack
- **React 18** + **Vite**
- **React Router v6** — Client-side routing
- **Axios** — API requests
- **React Icons** (Feather Icons) — UI icons
- **Bootstrap 5** — Grid & utility classes
- **Context API** — Global auth state

---

## 📁 Folder Structure

```
boarding-frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js             # Axios instance with base URL + auth header
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation bar (with avatar)
│   │   ├── ProtectedRoute.jsx   # Redirects to /login if not authenticated
│   │   ├── AdminRoute.jsx       # Redirects if not admin
│   │   └── AvatarUpload.jsx     # Profile photo upload component
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state (user, token, login, logout)
│   ├── pages/
│   │   ├── Home.jsx             # Browse all listings with filters
│   │   ├── Login.jsx            # Login form + forgot password link
│   │   ├── Register.jsx         # Register form
│   │   ├── ForgotPassword.jsx   # Request password reset
│   │   ├── ResetPassword.jsx    # Set new password via token
│   │   ├── Profile.jsx          # User profile (3 tabs: info, password, listings)
│   │   ├── AddBoarding.jsx      # Add new boarding listing
│   │   ├── BoardingDetail.jsx   # Single listing detail page
│   │   ├── Favorites.jsx        # Saved favorites
│   │   ├── MapPage.jsx          # Map view of listings
│   │   ├── AdminLogin.jsx       # Admin login page
│   │   ├── AdminDashboard.jsx   # Admin stats overview
│   │   ├── AdminUsers.jsx       # Manage all users
│   │   ├── AdminUserDetail.jsx  # Single user management
│   │   └── AdminBoardings.jsx   # Manage all boardings
│   ├── App.jsx                  # Route definitions
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + CSS variables
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Install dependencies
```bash
cd boarding-frontend
npm install
```

### 2. Make sure the backend is running first
The frontend expects the backend at **http://localhost:5001**

### 3. Start the frontend
```bash
npm run dev
```

App runs at: **http://localhost:3000** (or the port Vite assigns, check terminal output)

---

## 🔑 Default Login Credentials

> Run `node seed.js` inside the `server/` folder first to create these accounts.

### 👑 Admin Login
- **URL:** http://localhost:3000/admin
- **Email:** `admin@boarding.com`
- **Password:** `admin123`

### 👤 Regular User Login
- **URL:** http://localhost:3000/login
- **Email:** `john@example.com`
- **Password:** `user1234`

---

## 🗺️ Page Routes

| Route                        | Access        | Description                         |
|------------------------------|---------------|-------------------------------------|
| `/`                          | Public        | Home — browse all listings          |
| `/login`                     | Public        | User login                          |
| `/register`                  | Public        | Create new account                  |
| `/forgot-password`           | Public        | Request password reset              |
| `/reset-password/:token`     | Public        | Set new password                    |
| `/boarding/:id`              | Public        | View single listing details         |
| `/map`                       | Public        | Map view of listings                |
| `/add`                       | Logged In     | Add a new boarding listing          |
| `/favorites`                 | Logged In     | View saved favorites                |
| `/profile`                   | Logged In     | View/edit profile, change password  |
| `/admin`                     | Public        | Admin login page                    |
| `/admin/dashboard`           | Admin Only    | Stats dashboard                     |
| `/admin/users`               | Admin Only    | Manage all users                    |
| `/admin/users/:id`           | Admin Only    | User detail                         |
| `/admin/boardings`           | Admin Only    | Manage all boardings                |

---

## 🔐 How Auth Works in the Frontend

1. On login, the JWT token and user object are saved to `localStorage`
2. `AuthContext` reads them on app load and provides them globally
3. `ProtectedRoute` checks `isAuth` — if false, redirects to `/login`
4. `AdminRoute` checks `user.isAdmin` — if false, redirects to `/`
5. Every API call via `axios.js` automatically attaches the token:
   ```js
   // src/api/axios.js
   instance.interceptors.request.use(config => {
     const token = localStorage.getItem('bf_token');
     if (token) config.headers.Authorization = `Bearer ${token}`;
     return config;
   });
   ```

---

## 👤 Profile Page Features

The `/profile` page has three tabs:

### Tab 1 — Personal Info
- View your name, email, role, and member-since date
- Click **Edit** to update name and/or email
- Click **Save** to apply changes

### Tab 2 — Change Password
- Enter current password
- Enter and confirm new password
- Click **Update Password**

### Tab 3 — My Listings
- See all boarding listings you've added
- View or delete each listing
- Quick link to add a new listing

### Profile Photo Upload
- Click the avatar circle or the camera icon (📷) to pick a photo
- Preview appears instantly before saving
- Click **Save Photo** to upload to the server
- **Remove photo** button appears when a photo is set
- Falls back to initials (e.g., "KP") when no photo is uploaded

---

## 🔄 Forgot Password Flow

1. Go to `/login` → click **"Forgot password?"**
2. Enter your email on `/forgot-password`
3. A reset link appears on screen (in dev mode — no email server needed)
4. Copy and open the link → `/reset-password/:token`
5. Enter and confirm your new password
6. You are automatically logged in and redirected home

---

## 🌐 Axios Base URL

The API base URL is set in `src/api/axios.js`:
```js
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});
```

If your backend runs on a different port, update `baseURL` here.

---

## 📦 Key Dependencies

```json
"dependencies": {
  "axios": "^1.4.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.10.0",
  "react-router-dom": "^6.14.0"
}
```

Install with:
```bash
npm install axios react-icons react-router-dom
```

---

## 🚀 npm Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## ❓ Common Issues

| Issue | Fix |
|-------|-----|
| Blank page on load | Make sure `react-router-dom` is installed |
| API calls fail (Network Error) | Backend must be running on port 5001 |
| Images not loading | Check `http://localhost:5001/uploads/` is accessible |
| Avatar not updating in navbar | `updateUser()` from `AuthContext` must be called after upload |
| Login works but stays on login page | Check `AuthContext` reads from `localStorage` on mount |
| `useAuth` returns undefined | Make sure `<AuthProvider>` wraps `<App>` in `main.jsx` |
