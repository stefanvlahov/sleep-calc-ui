import React, { useState } from "react";
import { Link } from "react-router-dom";

interface ForgotPasswordFormProps {
    onForgotPassword: (username: string) => Promise<void>;
}

function ForgotPasswordForm({ onForgotPassword }: ForgotPasswordFormProps) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void onForgotPassword(username);
    };

    return (
        <form onSubmit={handleSubmit} aria-label="Forgot Password Form" className="space-y-4">
            <div>
                <input
                    id="forgot-password-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Send Reset Link
            </button>
            <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-blue-500 hover:underline">
                    Back to Login
                </Link>
            </div>
        </form>
    );
}

export default ForgotPasswordForm;
