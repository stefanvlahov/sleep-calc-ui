import { useState, useEffect } from "react";
import SleepInputForm from "./SleepInputForm";
import SleepStateDisplay from "./SleepStateDisplay";
import { useAuth } from "../hooks/useAuth.ts";

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

    useEffect(() => {
        const fetchInitialState = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:8080/api/sleep/state', {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                if (!response.ok) throw new Error('Failed to fetch initial state');
                const data = await response.json() as SleepState;
                setSleepState(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
        };
        void fetchInitialState();
    }, [token]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        const timeSlept = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        try {
            const response = await fetch('http://localhost:8080/api/sleep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ timeSlept }),
            });
            if (!response.ok) throw new Error('Something went wrong with the request');
            const data = await response.json() as SleepState;
            setSleepState(data);
            setHours('');
            setMinutes('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={logout} type="button" style={{ float: 'right' }}>Logout</button>
            <h1>Sleep Debt Tracker</h1>

            <SleepInputForm hoursValue={hours} minutesValue={minutes} onHoursChange={setHours} onMinutesChange={setMinutes} onSubmit={handleSubmit} />
            {isLoading && <p>Calculating...</p>}
            {error && <p style={{ color: 'red' }}>Error: </p>}
            {sleepState && (
                <SleepStateDisplay sleepDebt={sleepState.sleepDebt} sleepSurplus={sleepState.sleepSurplus} />
            )}
        </div>
    );
}

export default SleepTracker;