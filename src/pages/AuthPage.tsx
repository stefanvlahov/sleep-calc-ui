import { useState } from "react";
import LoginForm from "../components/LoginForm.tsx";
import RegistrationForm from "../components/RegistrationForm.tsx";
import AuthLayout from "../components/AuthLayout.tsx";

interface AuthPageProps {
    onRegister: (username: string, password: string) => Promise<void>;
    onLogin: (username: string, password: string) => Promise<void>;
    error: string | null;
}

function AuthPage({ onRegister, onLogin, error }: AuthPageProps) {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <AuthLayout
            title={isLoginView ? 'Welcome Back!' : 'Create an Account'}
            subtitle={isLoginView ? 'Login to your account to continue' : 'Start your journey to better sleep.'}
            error={error}
        >
            {isLoginView ? (
                <LoginForm onLogin={onLogin} />
            ) : (
                <RegistrationForm onRegister={onRegister} />
            )}

            <div className="mt-4 text-center">
                {isLoginView ? (
                    <p>
                        Don't have an account?{' '}
                        <button onClick={() => setIsLoginView(false)} className="text-blue-500 hover:underline">
                            Sign Up
                        </button>
                    </p>
                ) : (
                    <p>
                        Already have an account?{' '}
                        <button onClick={() => setIsLoginView(true)} className="text-blue-500 hover:underline">
                            Login
                        </button>
                    </p>
                )}
            </div>
        </AuthLayout>
    );
}

export default AuthPage;