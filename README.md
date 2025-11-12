### Sleep Debt Calculator UI (Vite + React + TypeScript)

Last updated: 2025-11-11

A lightweight front-end UI for a Sleep Debt Calculator. Built with Vite (React + TS template) and tested with Vitest + React Testing Library. This UI now supports JWT-based authentication for registration, login, and authenticated API calls with a modern, responsive UI built with Tailwind CSS.

---

### Features
- JWT auth: Register, Login, Logout
- Modern, responsive UI built with Tailwind CSS
- Unified authentication page with split-screen design
- Navigation bar with user avatar and quick logout
- Date selection for sleep entries (using DatePicker)
- Persisted session via localStorage
- Authenticated calls to protected endpoints with Bearer token
- Record sleep by entering hours, minutes, and date
- Automatically pads minutes with a leading zero (e.g., 8:5 becomes 8:05)
- Displays loading and error states during API calls
- Card-based layout for better visual hierarchy
- Shows formatted results to one decimal place: Current Sleep Debt and Current Sleep Surplus
- Dashboard overview:
  - Overall Sleep Debt and Overall Sleep Surplus cards
  - 7-day average of hours slept based on recent entries
  - Recent Sleep Entries table with date, hours slept, target (7.5h), and daily debt/surplus indicator
- Comprehensive unit tests for all major components

---

### Prerequisites
- Node.js 18+ (recommended for Vite 7)
- npm 9+ (or a compatible package manager)
- A running backend API
  - Auth endpoints: POST http://localhost:8080/api/auth/register and POST http://localhost:8080/api/auth/login
  - Sleep endpoints (protected): GET http://localhost:8080/api/sleep/state and POST http://localhost:8080/api/sleep
- Note: The Vite dev server proxies `/api` requests to `http://localhost:8080` automatically

---

### Getting Started
1. Install dependencies
    - npm install
2. Start the development server
    - npm run dev
    - Visit the URL printed in the terminal (typically http://localhost:5173)
3. Ensure the backend API is running on http://localhost:8080

---

### Usage
1) Authentication flow
- The app presents a unified AuthPage with toggle between Login and Registration
- Register with a username and password (sends POST /api/auth/register)
- Login with the same credentials (sends POST /api/auth/login)
  - On success, a JWT token is returned and stored in localStorage under key authToken
  - The app switches to the authenticated view with navigation bar
- Logout at any time using the button in the navbar (clears token from state and localStorage)

2) Tracking sleep (requires login)
- Select a date using the date picker (defaults to today)
- Enter Hours and Minutes in the form
- Press "Log Sleep" button
- The app will call the backend with payload: { "timeSlept": "HH:MM" } to POST /api/sleep,
  including Authorization: Bearer <token>
- On success, the UI shows in a card-based layout:
    - Current Sleep Debt: <value>
    - Current Sleep Surplus: <value>
- The app also fetches your initial state from GET /api/sleep/state when you log in
- If a request fails or returns non-OK, an error message is shown

3) Dashboard overview (requires login)
- The Dashboard fetches both your current state and recent sleep history in parallel:
  - GET /api/sleep/state → overall `sleepDebt` and `sleepSurplus`
  - GET /api/sleep/history → recent entries list
- It displays three cards:
  - Overall Sleep Debt (red if > 0)
  - Overall Sleep Surplus (green if > 0)
  - 7-Day Average of hours slept, computed from the fetched recent entries
- Recent Sleep Entries table shows:
  - Date, Hours Slept, Target (7.5), and Daily Debt/Surplus (`hoursSlept - 7.5`), formatted to one decimal. Positive values are shown with a leading “+” and green color; negatives are red.
- From the table header you can follow the "View all" link, which is intended for a full history page.

---

### JWT Auth Implementation Overview
- Provider: src/context/AuthProvider.tsx wraps the app and manages the token, login, and logout. It persists the token in localStorage under authToken.
- Context: src/context/AuthContext.ts defines the context shape { token, login, logout }.
- Hook: src/hooks/useAuth.ts exposes the auth context values. Use it inside function components under AuthProvider.

Example
- main.tsx
  - <AuthProvider>
      <App />
    </AuthProvider>
- Using the hook inside a component
  - import { useAuth } from '@/hooks/useAuth'
  - const { token, login, logout } = useAuth()

Protected requests
- Include the Authorization header: 'Authorization': `Bearer ${token}` when calling protected endpoints like /api/sleep and /api/sleep/state.

---

### Styling & UI
- Built with Tailwind CSS v4.1.13
- Responsive design with mobile-first approach
- PostCSS configuration for processing Tailwind directives
- Custom color scheme with blue accents for interactive elements
- Card-based components with shadows and rounded corners
- Focus states for accessibility
- Split-screen authentication page with background image

---

### API Contract
Auth
- Register: POST http://localhost:8080/api/auth/register
  - Body: { "username": string, "password": string }
  - Response: 200 OK (typically without token)
- Login: POST http://localhost:8080/api/auth/login
  - Body: { "username": string, "password": string }
  - Response: { "token": string }

Sleep (requires Authorization: Bearer <token>)
- Get state: GET http://localhost:8080/api/sleep/state
  - Response: { "sleepDebt": number, "sleepSurplus": number }
- Record sleep: POST http://localhost:8080/api/sleep
  - Body: { "timeSlept": "HH:MM" }
  - Response: { "sleepDebt": number, "sleepSurplus": number }

- Get recent history: GET http://localhost:8080/api/sleep/history
  - Response: Array<{
      "sleepDate": string,          // ISO date or yyyy-MM-dd
      "hoursSlept": number,        // e.g., 7.5
      "sleepDebt": number,         // running total or daily debt depending on backend
      "sleepSurplus": number       // running total or daily surplus depending on backend
    }>

Notes
- Minutes are padded to 2 digits before sending (e.g., "8:5" -> "08:05").
- Values are displayed with one decimal point.
- The Dashboard uses a client-side target of 7.5 hours/night to compute and display each entry's daily debt/surplus.

---

### Available Scripts
- npm run dev – Start Vite dev server
- npm run build – Type-check and build for production to dist/
- npm run preview – Preview the production build locally
- npm run lint – Run ESLint across the project
- npm run test – Run unit tests with Vitest

---

### Project Structure
- src/
    - App.tsx – Main container; orchestrates auth flow and renders Dashboard and/or SleepTracker
    - pages/
        - AuthPage.tsx – Unified authentication page with login/register toggle and split-screen layout
        - Dashboard.tsx – Authenticated dashboard showing overall state, 7-day average, and recent entries
    - components/
        - Layout.tsx – Wrapper component providing navbar and consistent page structure
        - Navbar.tsx – Navigation bar with branding, menu items, logout button, and user avatar
        - SleepInputForm.tsx – Form with date picker, hours and minutes inputs, submit handling
        - SleepStateDisplay.tsx – Card-based results section showing sleep debt and surplus
        - SleepTracker.tsx – Authenticated view that fetches initial state and records sleep with token
        - LoginForm.tsx – Collects username/password and triggers login with Tailwind styling
        - RegistrationForm.tsx – Collects username/password and triggers registration with Tailwind styling
    - utils/
        - api.ts – `fetchWithAuth` helper that attaches the JWT and logs out on 401/403
    - context/
        - AuthContext.ts – React context type and instance
        - AuthProvider.tsx – Provides token, login, logout (persists token to localStorage)
    - hooks/
        - useAuth.ts – Access the auth context (must be used under AuthProvider)
    - assets/
        - sleeping_photo.png – Background image for authentication page
        - userAvatar.png – Default user avatar displayed in navbar
    - main.tsx – React root and bootstrap, wraps App with AuthProvider
    - setupTests.ts – Testing setup (Vitest + Testing Library)
    - index.css – Global styles and Tailwind CSS directives

---

### Testing
- Unit tests use Vitest and React Testing Library:
    - src/App.test.tsx – App-level integration tests
    - src/pages/AuthPage.test.tsx – Authentication page interactions and toggle behavior
    - src/components/LoginForm.test.tsx – Form interactions for login
    - src/components/RegistrationForm.test.tsx – Form interactions for registration
    - src/components/SleepInputForm.test.tsx – Component-level tests for inputs and submission
    - src/components/SleepTracker.test.tsx – Sleep tracking component with mocked API calls
    - Note: Add tests for Dashboard and history rendering as needed.
- Run tests: npm run test

---

### Configuration Notes
- API calls use relative URLs (/api/...) which are proxied to http://localhost:8080 via Vite dev server
    - Proxy configuration is in vite.config.ts
    - To target another backend in production, update the backend URL or use environment variables
- Auth token persistence uses localStorage under key authToken
- Tailwind CSS configuration uses PostCSS (see postcss.config.ts)
- If you encounter CORS errors in development, ensure the backend allows requests from the Vite dev server origin (e.g., http://localhost:5173)

---

### Key Dependencies
- **React** v19.1.1 – UI library
- **Vite** v7.1.2 – Build tool and dev server
- **Tailwind CSS** v4.1.13 – Utility-first CSS framework
- **react-datepicker** v8.7.0 – Date picker component
- **Vitest** v3.2.4 – Unit testing framework
- **TypeScript** v5.8.3 – Type safety

---

### Linting
- ESLint is configured for TypeScript and React.
- Note: We split auth into separate files to avoid the react-refresh/only-export-components warning. Ensure component files export only components for best Fast Refresh behavior.
- Run: npm run lint

---

### Build & Deployment
- Build: npm run build (outputs to dist/)
- Preview: npm run preview
- Deploy the contents of dist/ to your static hosting provider of choice.

---

### Troubleshooting
- Backend not running:
    - The UI will show an error and no results. Start the backend on port 8080 or update the fetch URL.
- Unauthorized (401):
    - Ensure you are logged in. The Authorization header must be "Bearer <token>". If your session seems stale, try logging out and back in.
- CORS issues:
    - Configure CORS on the backend or use a Vite proxy during development.
- Port conflicts:
    - Vite defaults to port 5173; use --port or change configuration if needed.

---

### License
- Not specified. If you plan to open-source, consider adding a LICENSE file.
