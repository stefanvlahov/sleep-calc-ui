type SleepStateDisplayProps = {
    sleepDebt: number;
    sleepSurplus: number;
};

function SleepStateDisplay({ sleepDebt, sleepSurplus }: SleepStateDisplayProps) {
    return (
        <div>
            <h2>Results</h2>
            <p>Current Sleep Debt: {sleepDebt.toFixed(1)}</p>
            <p>Current Sleep Surplus: {sleepSurplus.toFixed(1)}</p>
        </div>
    );
}

export default SleepStateDisplay;