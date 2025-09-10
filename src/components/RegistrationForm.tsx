import React, { useState }  from "react";

interface RegistrationFormProps {
    onRegister: (username: string, password: string) => Promise<void>;
}

function RegistrationForm({ onRegister }: RegistrationFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void onRegister(username, password);
    };

    return (
        <form onSubmit={handleSubmit} aria-label={"Registration Form"}>
            <h2>Register</h2>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Register</button>
        </form>
    );
}

export default RegistrationForm;