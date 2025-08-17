import {useState} from "react";
import SleepInputForm from "./components/SleepInputForm";
import SleepStateDisplay from "./components/SleepStateDisplay";

type SleepState = {
    sleepDebt: number;
    sleepSurplus: number;
};

function App() {
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const [sleepState, setSleepState] = useState<SleepState | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        const formattedMinutes = minutes.padStart(2, '0');
        const timeSlept = `${hours}:${formattedMinutes}`;

        try {
            const response = await fetch('http://localhost:8080/api/sleep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({timeSlept}),
            });

            if (!response.ok) {
                throw new Error('Something went wrong with the request');
            }

            const data: SleepState = await response.json();
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
            <h1>Sleep Debt Tracker</h1>

            <SleepInputForm hoursValue={hours}
                            minutesValue={minutes}
                            onHoursChange={setHours}
                            onMinutesChange={setMinutes}
                            onSubmit={handleSubmit}
            />

            {isLoading && <p>Calculating...</p>}
            {error && <p style={{color: 'red'}}>Error: {error}</p>}

            {sleepState && (
                <SleepStateDisplay sleepDebt={sleepState.sleepDebt} sleepSurplus={sleepState.sleepSurplus}/>
            )}
        </div>
    );
}

export default App