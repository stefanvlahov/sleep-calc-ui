import { useAuth } from "./hooks/useAuth.ts";
import SleepTracker from "./components/SleepTracker.tsx";
import { useState } from "react";
import AuthPage from "./pages/AuthPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
    const { token, login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (username: string, password: string) => {
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || 'Registration failed.');
            }
            alert('Registration successful! Please Log in.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    const handleLogin = async (username: string, password: string) => {
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password }),
            });
            if (!response.ok) throw new Error('Login failed. Please check your credentials.');
            const data = await response.json() as { token: string };
            if (data.token) {
                login(data.token);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    if (token) {
        return (
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/log-sleep" element={<SleepTracker />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<AuthPage onLogin={handleLogin} onRegister={handleRegister} error={error} />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;