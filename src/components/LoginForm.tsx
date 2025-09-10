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
        <form onSubmit={handleSubmit} aria-label={"Login Form"}>
            <h2>Login</h2>
            <div>
                <label htmlFor="login-username">Username</label>
                <input id="login-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;