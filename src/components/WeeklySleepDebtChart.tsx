import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DailyReportItem {
    date: string;
    hoursSlept: number;
    debtChange: number;
    surplusChange: number;
}

interface WeeklySleepDebtChartProps {
    data: DailyReportItem[];
    totalDebt: number;
    totalSurplus: number;
    percentChange: number;
}

const WeeklySleepDebtChart = ({ data, totalDebt, totalSurplus, percentChange }: WeeklySleepDebtChartProps) => {
    // Determine if we're in surplus (positive is good) or debt (negative/debt is bad)
    const netBalance = totalSurplus - totalDebt;
    const isSurplus = netBalance >= 0;
    const displayValue = isSurplus ? totalSurplus : totalDebt;
    const formattedValue = `${Math.floor(Math.abs(displayValue))}h ${Math.round((Math.abs(displayValue) % 1) * 60)}m`;

    // Transform data to include day name for display
    const chartData = data.map(item => ({
        ...item,
        day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        debt: item.debtChange - item.surplusChange // Net change for the day
    }));

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sleep Debt/Surplus</h3>

            <div className="mb-6">
                <div className={`text-4xl font-bold ${isSurplus ? 'text-green-500' : 'text-red-500'} mb-2`}>
                    {isSurplus ? '+' : '-'}{formattedValue}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span>This Week</span>
                    <span className={`ml-2 flex items-center ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {percentChange >= 0 ? (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        )}
                        {Math.abs(percentChange)}%
                    </span>
                </div>
            </div>

            <div className="flex-grow min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="debt" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.debt >= 0 ? '#10B981' : '#EF4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeeklySleepDebtChart;
