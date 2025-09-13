import { useAuth } from "./hooks/useAuth.ts";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import SleepTracker from "./components/SleepTracker.tsx";
import { useState } from "react";

function App() {
    const { token, login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (username: string, password: string) => {
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
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
            const response = await fetch('http://localhost:8080/api/auth/login', {
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

    return (
        <div>
            <h1 className="text-3xl font-bold underline text-blue-500">Welcome to Sleep Tracker</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <hr />
            <RegistrationForm onRegister={handleRegister} />
            <hr />
            <LoginForm onLogin={handleLogin} />
        </div>
    );
}

export default App