import React, { useState } from "react";

interface LoginFormProps {
    onLogin: (username: string, password: string) => Promise<void>;
}

function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void onLogin(username, password);
    };

    return (
        <form onSubmit={handleSubmit} aria-label={"Login Form"} className="space-y-6">
            <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1">
                    <input
                        id="login-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-blue-500 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Login</button>
        </form>
    );
}

export default LoginForm;