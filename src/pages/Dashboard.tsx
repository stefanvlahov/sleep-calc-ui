import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { fetchWithAuth } from '../utils/api';

// Type for the current sleep state (debt/surplus)
interface SleepState {
    sleepDebt: number;
    sleepSurplus: number;
}

// TODO: Define type for recent sleep entries later

function Dashboard() {
    const { logout } = useAuth(); // Get logout for fetchWithAuth
    const [sleepState, setSleepState] = useState<SleepState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the current sleep state when the component loads
    useEffect(() => {
        const fetchCurrentState = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchWithAuth('/api/sleep/state', {}, logout);
                if (!response.ok) {
                    throw new Error('Failed to fetch sleep state');
                }
                const data = await response.json() as SleepState;
                setSleepState(data);
            } catch (err) {
                if ((err as Error).message !== 'Unauthorized') {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        };
        void fetchCurrentState();
    }, [logout]); // Dependency on logout

    // Placeholder data until we fetch history
    const recentEntries: any[] = []; // Empty array for now

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sleep Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome back, let's check your sleep patterns.</p>
                    </div>
                    {/* TODO: Make this button navigate to the Log Sleep page */}
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Log New Sleep
                    </button>
                </div>

                {/* Loading and Error States */}
                {isLoading && <p>Loading dashboard data...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {/* Stats Cards */}
                {sleepState && !isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Sleep Debt</h3>
                            <p className={`text-3xl font-bold ${sleepState.sleepDebt > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                {sleepState.sleepDebt.toFixed(1)} hours
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Below target sleep</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Sleep Surplus</h3>
                            <p className={`text-3xl font-bold ${sleepState.sleepSurplus > 0 ? 'text-green-500' : 'text-gray-900'}`}>
                                {sleepState.sleepSurplus.toFixed(1)} hours
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Above target sleep</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">7-Day Average</h3>
                            <p className="text-3xl font-bold text-gray-900">-- hours</p> {/* Placeholder */}
                            <p className="text-xs text-gray-500 mt-2">--</p> {/* Placeholder */}
                        </div>
                    </div>
                )}

                {/* Recent Sleep Entries Table (Placeholder) */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Sleep Entries</h2>
                        {/* TODO: Link to History page */}
                        <a href="#" className="text-sm text-blue-500 hover:underline">View all</a>
                    </div>

                    <div className="overflow-x-auto">
                        {recentEntries.length > 0 ? (
                            <p>Table will go here...</p> // Placeholder for table
                        ) : (
                            <p className="p-6 text-gray-500">No recent sleep entries found.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;