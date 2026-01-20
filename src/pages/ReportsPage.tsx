import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WeeklySleepDebtChart from '../components/WeeklySleepDebtChart';
import WeeklySleepTrendChart from '../components/WeeklySleepTrendChart';
import { useAuth } from '../hooks/useAuth';

// Mock data interfaces (replace with actual API types)
interface ReportsData {
    weeklyDebt: {
        totalDebt: number;
        percentChange: number;
        dailyData: { day: string; debt: number }[];
    };
    weeklyTrend: {
        trendValue: number;
        percentChange: number;
        weeklyData: { day: string; hours: number }[];
    };
}

const ReportsPage = () => {
    const { logout } = useAuth();
    const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
    const [data, setData] = useState<ReportsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Replace with actual API call
                // const response = await fetchWithAuth(`/api/reports/${timeRange}`, {}, logout);
                // if (!response.ok) throw new Error('Failed to fetch reports data');
                // const result = await response.json();
                // setData(result);

                // Mocking data for now as per plan/assumption
                // Simulating API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                setData({
                    weeklyDebt: {
                        totalDebt: 5.5,
                        percentChange: 10,
                        dailyData: [
                            { day: 'Mon', debt: 0.5 },
                            { day: 'Tue', debt: -1.2 },
                            { day: 'Wed', debt: 2.0 },
                            { day: 'Thu', debt: 1.5 },
                            { day: 'Fri', debt: -0.5 },
                            { day: 'Sat', debt: 3.0 },
                            { day: 'Sun', debt: 0.2 },
                        ]
                    },
                    weeklyTrend: {
                        trendValue: -2.25,
                        percentChange: -5,
                        weeklyData: [
                            { day: 'Week 1', hours: 6.5 },
                            { day: 'Week 2', hours: 7.2 },
                            { day: 'Week 3', hours: 5.8 },
                            { day: 'Week 4', hours: 7.5 },
                        ]
                    }
                });

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchReports();
    }, [timeRange, logout]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sleep Reports</h1>
                    <p className="text-gray-600 mt-1">Analyze your sleep patterns over time with weekly and monthly summaries.</p>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setTimeRange('weekly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === 'weekly'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeRange('monthly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === 'monthly'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                    </div>

                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Report
                    </button>
                </div>

                {isLoading && <p>Loading reports...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {!isLoading && data && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <WeeklySleepDebtChart
                            data={data.weeklyDebt.dailyData}
                            totalDebt={data.weeklyDebt.totalDebt}
                            percentChange={data.weeklyDebt.percentChange}
                        />
                        <WeeklySleepTrendChart
                            data={data.weeklyTrend.weeklyData}
                            trendValue={data.weeklyTrend.trendValue}
                            percentChange={data.weeklyTrend.percentChange}
                            averageHours={7.5} // Mock value
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ReportsPage;
