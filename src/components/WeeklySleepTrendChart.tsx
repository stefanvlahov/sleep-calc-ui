import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklySleepTrendChartProps {
    data: { day: string; hours: number }[];
    averageHours: number; // Or change relative to last week? The design shows "-2h 15m" and "Last 4 Weeks -5%". I'll stick to the design.
    trendValue: number; // e.g. -2.25 (hours)
    percentChange: number;
}

const WeeklySleepTrendChart = ({ data, trendValue, percentChange }: WeeklySleepTrendChartProps) => {
    const isPositive = trendValue >= 0;
    const formattedTrend = `${Math.floor(Math.abs(trendValue))}h ${Math.round((Math.abs(trendValue) % 1) * 60)}m`;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sleep Hours Trend</h3>

            <div className="mb-6">
                <div className={`text-4xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'} mb-2`}>
                    {isPositive ? '+' : '-'}{formattedTrend}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span>Last 4 Weeks</span>
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
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                        <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeeklySleepTrendChart;
