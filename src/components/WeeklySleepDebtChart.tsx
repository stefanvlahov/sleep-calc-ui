import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeeklySleepDebtChartProps {
    data: { day: string; debt: number }[];
    totalDebt: number;
    percentChange: number;
}

const WeeklySleepDebtChart = ({ data, totalDebt, percentChange }: WeeklySleepDebtChartProps) => {
    const isSurplus = totalDebt >= 0;
    const formattedDebt = `${Math.floor(Math.abs(totalDebt))}h ${Math.round((Math.abs(totalDebt) % 1) * 60)}m`;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sleep Debt/Surplus</h3>

            <div className="mb-6">
                <div className={`text-4xl font-bold ${isSurplus ? 'text-green-500' : 'text-red-500'} mb-2`}>
                    {isSurplus ? '+' : '-'}{formattedDebt}
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
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="debt" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
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
