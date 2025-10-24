import { useState, useEffect } from "react";
import SleepInputForm from "./SleepInputForm";
import SleepStateDisplay from "./SleepStateDisplay";
import { useAuth } from "../hooks/useAuth.ts";
import Layout from "./Layout";
import { fetchWithAuth } from "../utils/api.ts";

interface SleepState {
    sleepDebt: number;
    sleepSurplus: number;
}

function SleepTracker() {
    const { token, logout } = useAuth();
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [sleepState, setSleepState] = useState<SleepState | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchInitialState = async () => {
            if (!token) return;
            setError(null);
            try {
                const response = await fetchWithAuth('/api/sleep/state', {}, logout);
                if (!response.ok) throw new Error('Failed to fetch initial state');
                const data = await response.json() as SleepState;
                setSleepState(data);
            } catch (err) {
                if ((err as Error).message !== 'Unauthorized: Please log in again.') {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                }
            }
        };
        void fetchInitialState();
    }, [token]);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleSubmit = async () => {
        console.log("Date to submit: ", selectedDate);
        setIsLoading(true);
        setError(null);
        const timeSlept = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        try {
            const response = await fetchWithAuth('/api/sleep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeSlept }),
            }, logout);

            if (!response.ok) throw new Error('Something went wrong with the request');
            const data = await response.json() as SleepState;
            setSleepState(data);
            setHours('');
            setMinutes('');
        } catch (err) {
            if ((err as Error).message === 'Unauthorized: Please log in again.') {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            { token && (
                <div>
                    <SleepInputForm
                        hoursValue={hours}
                        minutesValue={minutes}
                        onHoursChange={setHours}
                        onMinutesChange={setMinutes}
                        onSubmit={handleSubmit}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                    />
                    {isLoading && <p className="text-center my-4">Calculating...</p>}
                    {error && <p className="text-red-500 text-center my-4">Error: {error}</p>}
                    {sleepState && (
                        <SleepStateDisplay sleepDebt={sleepState.sleepDebt} sleepSurplus={sleepState.sleepSurplus} />
                    )}
                </div>
            )}
            {!token && <p>Session Expired. Redirecting to login...</p>}
        </Layout>
    );
}

export default SleepTracker;