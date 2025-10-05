import { useAuth } from "./hooks/useAuth.ts";
import SleepTracker from "./components/SleepTracker.tsx";
import { useState } from "react";
import AuthPage from "./pages/AuthPage.tsx";

function App() {
    const { token, login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (username: string, password: string) => {
        setError(null);
        try {
            const response = await fetch('/api/auth/register', {
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
            const response = await fetch('/api/auth/login', {
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
        return <SleepTracker />
    }

    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} error={error}/>
}

export default App