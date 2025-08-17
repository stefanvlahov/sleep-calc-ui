type SleepStateDisplayProps = {
    sleepDebt: number;
    sleepSurplus: number;
};

function SleepStateDisplay({ sleepDebt, sleepSurplus }: SleepStateDisplayProps) {
    return (
        <div>
            <h2>Result</h2>
            <p>Current Sleep Debt: {sleepDebt}</p>
            <p>Current Sleep Surplus: {sleepSurplus}</p>
        </div>
    );
}

export default SleepStateDisplay;