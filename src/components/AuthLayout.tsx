import React from 'react';
import sleepingPhoto from '../assets/sleeping_photo.png';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    error?: string | null;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, error }) => {
    return (
        <div className="min-h-screen md:flex max-w-6xl mx-auto px-4">
            {/* Left Panel: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    {/* Display the error message if it exists */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">SleepTracker</h1>
                        {(title || subtitle) && (
                            <>
                                {title && <h2 className="text-3xl font-bold mt-4">{title}</h2>}
                                {subtitle && <p className="text-gray-600">{subtitle}</p>}
                            </>
                        )}
                    </div>

                    {children}
                </div>
            </div>

            {/* Right Panel: Image and Branding */}
            <div className="hidden md:block w-1/2">
                <img src={sleepingPhoto} alt="Person sleeping peacefully" className="w-full max-h-screen object-cover" />
            </div>
        </div>
    );
};

export default AuthLayout;
