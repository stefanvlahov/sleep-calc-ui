import { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { fetchWithAuth } from '../utils/api';

interface SleepHistoryEntry {
    sleepDate: string;
    hoursSlept: number;
    sleepDebt: number;
    sleepSurplus: number;
}

function HistoryPage() {
    const { logout } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewDate, setViewDate] = useState<Date>(new Date()); // Tracks the month currently being viewed
    const [historyData, setHistoryData] = useState<SleepHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate the date range for the current view (start to end of the month)
    const { startDate, endDate } = useMemo(() => {
        const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        // Date(year, month + 1, 0) gets the last day of the current month
        const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        
        const fmt = (d: Date) => {
            const offset = d.getTimezoneOffset() * 60000;
            return new Date(d.getTime() - offset).toISOString().split('T')[0];
        };

        return { startDate: fmt(start), endDate: fmt(end) };
    }, [viewDate]);

    // Fetch history whenever the viewed month changes
    useEffect(() => {
        const fetchHistoryRange = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchWithAuth(
                    `/api/sleep/history/range?from=${startDate}&to=${endDate}`,
                    {},
                    logout
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch history data');
                }

                const data = await response.json() as SleepHistoryEntry[];
                setHistoryData(data);
            } catch (err) {
                if ((err as Error).message !== 'Unauthorized') {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchHistoryRange();
    }, [startDate, endDate, logout]);

    // Helper to find the entry for the selected date
    const selectedEntry = useMemo(() => {
        const offset = selectedDate.getTimezoneOffset() * 60000;
        const dateString = new Date(selectedDate.getTime() - offset).toISOString().split('T')[0];

        return historyData.find(entry => entry.sleepDate === dateString);
    }, [selectedDate, historyData]);

    // Formatter: convert decimal hours to "Xh YYm" with zero‑padded minutes for primary metrics
    const formatHmPadded = (val: number): string => {
        const abs = Math.abs(val);
        let hours = Math.floor(abs);
        let minutes = Math.round((abs - hours) * 60);
        if (minutes === 60) { hours += 1; minutes = 0; }
        const mm = minutes.toString().padStart(2, '0');
        return `${hours}h ${mm}m`;
    };

    // Function to determine class name for calendar days based on data
    const getDayClassName = (date: Date): string => {
        const offset = date.getTimezoneOffset() * 60000;
        const dateString = new Date(date.getTime() - offset).toISOString().split('T')[0];

        const entry = historyData.find(e => e.sleepDate === dateString);

        if (!entry) return '';

        // Green for surplus, Red for debt
        if (entry.sleepSurplus > 0) return 'bg-green-200 text-green-800 font-bold rounded-full';
        if (entry.sleepDebt > 0) return 'bg-red-200 text-red-800 font-bold rounded-full';
        return '';
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Historical Data</h1>
                <p className="text-gray-600 mb-8">View and analyze your sleep patterns over time.</p>

                {error && <p className="text-red-500 mb-4">Error: {error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Calendar */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex justify-center">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => date && setSelectedDate(date)}
                            onMonthChange={(date) => setViewDate(date)}
                            inline
                            dayClassName={getDayClassName}
                        />
                    </div>

                    {/* Right Column: Details for Selected Date */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                            Details for {selectedDate.toLocaleDateString()}
                        </h2>

                        {isLoading ? (
                            <p className="text-gray-500">Loading data...</p>
                        ) : selectedEntry ? (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase font-semibold">Sleep Duration</p>
                                    <p className="text-3xl font-bold text-gray-900">{formatHmPadded(selectedEntry.hoursSlept)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase font-semibold">Target</p>
                                    <p className="text-xl text-gray-700">{formatHmPadded(7.5)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase font-semibold">Sleep Surplus</p>
                                        <p className={`text-xl font-bold ${selectedEntry.sleepSurplus > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                                            {(() => {
                                                const formatHm = (val: number) => {
                                                    const abs = Math.abs(val);
                                                    let hours = Math.floor(abs);
                                                    let minutes = Math.round((abs - hours) * 60);
                                                    if (minutes === 60) { hours += 1; minutes = 0; }
                                                    return `${hours}h ${minutes}m`;
                                                };
                                                return selectedEntry.sleepSurplus > 0
                                                    ? `+${formatHm(selectedEntry.sleepSurplus)}`
                                                    : '0h 0m';
                                            })()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase font-semibold">Cumulative Debt</p>
                                        <p className={`text-xl font-bold ${selectedEntry.sleepDebt > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {(() => {
                                                const formatHm = (val: number) => {
                                                    const abs = Math.abs(val);
                                                    let hours = Math.floor(abs);
                                                    let minutes = Math.round((abs - hours) * 60);
                                                    if (minutes === 60) { hours += 1; minutes = 0; }
                                                    return `${hours}h ${minutes}m`;
                                                };
                                                return selectedEntry.sleepDebt > 0
                                                    ? `-${formatHm(selectedEntry.sleepDebt)}`
                                                    : '0h 0m';
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-md">
                                <p className="text-gray-500">No sleep record found for this date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default HistoryPage;