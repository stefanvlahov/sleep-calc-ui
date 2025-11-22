interface SleepStateDisplayProps {
    sleepDebt: number;
    sleepSurplus: number;
}

function SleepStateDisplay({ sleepDebt, sleepSurplus }: SleepStateDisplayProps) {
    return (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-sm font-medium text-gray-500">Current Sleep Debt</h3>
                <p className="mt-2 text-3xl font-bold text-red-500">
                    {sleepDebt.toFixed(1)} hours
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-sm font-medium text-gray-500">Current Sleep Surplus</h3>
                <p className="mt-2 text-3xl font-bold text-green-500">
                    {sleepSurplus.toFixed(1)} hours
                </p>
            </div>
        </div>
    );
}

export default SleepStateDisplay;