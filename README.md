### Sleep Debt Calculator UI (Vite + React + TypeScript)

Last updated: 2025-09-09

A lightweight front-end UI for a Sleep Debt Calculator. Built with Vite (React + TS template) and tested with Vitest + React Testing Library. This UI now supports JWT-based authentication for registration, login, and authenticated API calls.

---

### Features
- JWT auth: Register, Login, Logout
- Persisted session via localStorage
- Authenticated calls to protected endpoints with Bearer token
- Record sleep by entering hours and minutes
- Automatically pads minutes with a leading zero (e.g., 8:5 becomes 8:05)
- Displays loading and error states during API calls
- Shows formatted results to one decimal place: Current Sleep Debt and Current Sleep Surplus
- Unit tests for core UI interactions

---

### Prerequisites
- Node.js 18+ (recommended for Vite 7)
- npm 9+ (or a compatible package manager)
- A running backend API
  - Auth endpoints: POST http://localhost:8080/api/auth/register and POST http://localhost:8080/api/auth/login
  - Sleep endpoints (protected): GET http://localhost:8080/api/sleep/state and POST http://localhost:8080/api/sleep

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
- Register with a username and password (sends POST /api/auth/register)
- Login with the same credentials (sends POST /api/auth/login)
  - On success, a JWT token is returned and stored in localStorage under key authToken
  - The app switches to the authenticated view
- Logout at any time (clears token from state and localStorage)

2) Tracking sleep (requires login)
- Enter Hours and Minutes in the form and press “Record Sleep”.
- The app will call the backend with payload: { "timeSlept": "HH:MM" } to POST /api/sleep,
  including Authorization: Bearer <token>.
- On success, the UI shows:
    - Current Sleep Debt: <value>
    - Current Sleep Surplus: <value>
- The app also fetches your initial state from GET /api/sleep/state when you log in.
- If a request fails or returns non-OK, an error message is shown.

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

Notes
- Minutes are padded to 2 digits before sending (e.g., "8:5" -> "08:05").
- Values are displayed with one decimal point.

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
    - App.tsx – Main container; orchestrates auth flow and, once logged in, sleep tracking
    - components/
        - SleepInputForm.tsx – Controlled inputs for hours and minutes, submit handling
        - SleepStateDisplay.tsx – Results section showing sleep debt and surplus
        - SleepTracker.tsx – Authenticated view that fetches initial state and records sleep with token
        - LoginForm.tsx – Collects username/password and triggers login
        - RegistrationForm.tsx – Collects username/password and triggers registration
    - context/
        - AuthContext.ts – React context type and instance
        - AuthProvider.tsx – Provides token, login, logout (persists token to localStorage)
    - hooks/
        - useAuth.ts – Access the auth context (must be used under AuthProvider)
    - main.tsx – React root and bootstrap, wraps App with AuthProvider
    - setupTests.ts – Testing setup (Vitest + Testing Library)

---

### Testing
- Unit tests use Vitest and React Testing Library:
    - src/components/LoginForm.test.tsx – Form interactions for login
    - src/components/SleepInputForm.test.tsx – Component-level tests for inputs and submission
- Run tests: npm run test

---

### Configuration Notes
- API base URL is currently hard-coded as http://localhost:8080 in App.tsx and SleepTracker.tsx.
    - To target another backend, update those fetch URLs or introduce an environment variable (e.g., VITE_API_BASE_URL) and read it via import.meta.env.VITE_API_BASE_URL.
- Auth token persistence uses localStorage under key authToken.
- If you encounter CORS errors in development, ensure the backend allows requests from the Vite dev server origin (e.g., http://localhost:5173) or configure a Vite dev server proxy.

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
