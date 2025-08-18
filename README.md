### Sleep Debt Calculator UI (Vite + React + TypeScript)

A lightweight front-end UI for a Sleep Debt Calculator. Built with Vite (React + TS template) and tested with Vitest + React Testing Library. This UI records sleep sessions and displays your current sleep debt and sleep surplus using a backend API.

---

### Features
- Record sleep by entering hours and minutes
- Automatically pads minutes with a leading zero (e.g., 8:5 becomes 8:05)
- Displays loading and error states during API calls
- Shows formatted results to one decimal place: Current Sleep Debt and Current Sleep Surplus
- Unit tests for core UI interactions

---

### Prerequisites
- Node.js 18+ (recommended for Vite 7)
- npm 9+ (or a compatible package manager)
- A running backend API exposing POST http://localhost:8080/api/sleep

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
- Enter Hours and Minutes in the form and press “Record Sleep”.
- The app will call the backend with payload: { "timeSlept": "H:MM" }.
- On success, the UI shows:
    - Current Sleep Debt: <value>
    - Current Sleep Surplus: <value>
- If the request fails or the backend returns a non-OK status, an error message is shown.

---

### API Contract
- Endpoint: POST http://localhost:8080/api/sleep
- Request Body (JSON):
    - { "timeSlept": "H:MM" }
- Success Response (JSON):
    - { "sleepDebt": number, "sleepSurplus": number }
- Notes:
    - Minutes are padded to 2 digits before sending (e.g., "8:5" -> "8:05").
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
    - App.tsx – Main container; orchestrates form, API call, loading/error, and results
    - components/
        - SleepInputForm.tsx – Controlled inputs for hours and minutes, submit handling
        - SleepStateDisplay.tsx – Results section showing sleep debt and surplus
    - main.tsx – React root and bootstrap
    - setupTests.ts – Jest-DOM setup for Vitest

---

### Testing
- Unit tests use Vitest and React Testing Library:
    - src/App.test.tsx – End-to-end style UI test for the main flow and payload formatting
    - src/components/SleepInputForm.test.tsx – Component-level tests for inputs and submission
- Run tests: npm run test

---

### Configuration Notes
- API URL is currently hard-coded to http://localhost:8080 in src/App.tsx.
    - To target another backend, update the fetch URL in App.tsx or introduce an environment variable (e.g., VITE_API_BASE_URL) and read it via import.meta.env.VITE_API_BASE_URL.
- If you encounter CORS errors in development, ensure the backend allows requests from the Vite dev server origin (e.g., http://localhost:5173) or configure a Vite dev server proxy.

---

### Linting
- ESLint is configured for TypeScript and React (including react-hooks, react-refresh, react-dom, and react-x plugins).
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
- CORS issues:
    - Configure CORS on the backend or use a Vite proxy during development.
- Port conflicts:
    - Vite defaults to port 5173; use --port or change configuration if needed.

---

### License
- Not specified. If you plan to open-source, consider adding a LICENSE file.
