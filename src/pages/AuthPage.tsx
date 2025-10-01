import {useState} from "react";
import LoginForm from "../components/LoginForm.tsx";
import RegistrationForm from "../components/RegistrationForm.tsx";
import sleepingPhoto from '../assets/sleeping_photo.png';

interface AuthPageProps {
    onRegister: (username: string, password: string) => Promise<void>;
    onLogin: (username: string, password: string) => Promise<void>;
    error: string | null;
}

function AuthPage({ onRegister, onLogin, error }: AuthPageProps) {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen md:flex max-w-6xl mx-auto px-4">
            {/* Left Panel: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    {/* Display the error message if it exists */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">SleepTracker</h1>
                        <h2 className="text-3xl font-bold mt-4">
                            {isLoginView ? 'Welcome Back!' : 'Create an Account'}
                        </h2>
                        <p className="text-gray-600">
                            {isLoginView ? 'Login to your account to continue' : 'Start your journey to better sleep.'}
                        </p>
                    </div>

                    {isLoginView ? (
                        <LoginForm onLogin={onLogin}/>
                    ) : (
                        <RegistrationForm onRegister={onRegister}/>
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
                </div>
            </div>

            {/* Right Panel: Image and Branding */}
            <div className="hidden md:block w-1/2">
                <img src={sleepingPhoto} alt="Person sleeping peacefully" className="w-full max-h-screen object-cover"/>
            </div>
        </div>
    );
}

export default AuthPage;