import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ResetPasswordFormProps {
    onResetPassword: (password: string) => Promise<void>;
}

function ResetPasswordForm({ onResetPassword }: ResetPasswordFormProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError(null);
        void onResetPassword(password);
    };

    return (
        <form onSubmit={handleSubmit} aria-label="Reset Password Form" className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div>
                <label htmlFor="reset-password" className="sr-only">New Password</label>
                <input
                    id="reset-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="reset-password-confirm" className="sr-only">Confirm New Password</label>
                <input
                    id="reset-password-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Reset Password
            </button>
            <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-blue-500 hover:underline">
                    Back to Login
                </Link>
            </div>
        </form>
    );
}

export default ResetPasswordForm;
