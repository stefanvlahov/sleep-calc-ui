import { useAuth } from "./hooks/useAuth.ts";
import SleepTracker from "./components/SleepTracker.tsx";
import { useState } from "react";
import AuthPage from "./pages/AuthPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HistoryPage from "./pages/HistoryPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import AuthLayout from "./components/AuthLayout.tsx";
import ForgotPasswordForm from "./components/ForgotPasswordForm.tsx";
import ResetPasswordForm from "./components/ResetPasswordForm.tsx";

function App() {
    const { token, login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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
                body: JSON.stringify({ username, password }),
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

    const handleForgotPassword = async (email: string) => {
        setError(null);
        try {
            // Mock backend call
            console.log(`Requesting password reset for ${email}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
            alert('If an account exists for that email, a password reset link has been sent.');
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    const handleResetPassword = async (password: string) => {
        setError(null);
        try {
            // Mock backend call
            console.log(`Resetting password to ${password}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
            alert('Password reset successful. Please login with your new password.');
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    if (token) {
        return (
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/log-sleep" element={<SleepTracker />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<AuthPage onLogin={handleLogin} onRegister={handleRegister} error={error} />} />
            <Route path="/forgot-password" element={
                <AuthLayout title="Forgot Password" subtitle="Enter your email to reset your password" error={error}>
                    <ForgotPasswordForm onForgotPassword={handleForgotPassword} />
                </AuthLayout>
            } />
            <Route path="/reset-password" element={
                <AuthLayout title="Reset Password" subtitle="Enter your new password" error={error}>
                    <ResetPasswordForm onResetPassword={handleResetPassword} />
                </AuthLayout>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;