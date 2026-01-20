import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WeeklySleepDebtChart from '../components/WeeklySleepDebtChart';
import WeeklySleepTrendChart from '../components/WeeklySleepTrendChart';
import { useAuth } from '../hooks/useAuth';
import { fetchWithAuth } from '../utils/api';

// Interfaces matching backend DTOs
interface DailyReportItem {
    date: string;
    hoursSlept: number;
    debtChange: number;
    surplusChange: number;
}

interface WeeklyReportDTO {
    netSleepDebt: number;
    netSleepSurplus: number;
    percentageChange: number;
    dailyItems: DailyReportItem[];
}

interface WeeklyReportItem {
    weekLabel: string;
    averageHoursSlept: number;
}

interface MonthlyReportDTO {
    averageHoursSlept: number;
    percentageChange: number;
    weeklyItems: WeeklyReportItem[];
}

interface ReportsData {
    weekly: WeeklyReportDTO;
    monthly: MonthlyReportDTO;
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
                // Fetch both weekly and monthly reports
                const [weeklyResponse, monthlyResponse] = await Promise.all([
                    fetchWithAuth('/api/reports/weekly', {}, logout),
                    fetchWithAuth('/api/reports/monthly', {}, logout)
                ]);

                if (!weeklyResponse.ok) throw new Error('Failed to fetch weekly report');
                if (!monthlyResponse.ok) throw new Error('Failed to fetch monthly report');

                const weeklyData: WeeklyReportDTO = await weeklyResponse.json();
                const monthlyData: MonthlyReportDTO = await monthlyResponse.json();

                setData({
                    weekly: weeklyData,
                    monthly: monthlyData
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchReports();
    }, [logout]);

    const handleExport = async () => {
        try {
            const toDate = new Date();
            const fromDate = new Date();

            if (timeRange === 'weekly') {
                fromDate.setDate(toDate.getDate() - 7);
            } else {
                fromDate.setDate(toDate.getDate() - 30);
            }

            const toStr = toDate.toISOString().split('T')[0];
            const fromStr = fromDate.toISOString().split('T')[0];

            const response = await fetchWithAuth(
                `/api/reports/export?from=${fromStr}&to=${toStr}`,
                {},
                logout
            );

            if (!response.ok) throw new Error('Failed to export report');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sleep_report_${fromStr}_to_${toStr}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Export failed:', err);
            setError(err instanceof Error ? err.message : 'Export failed');
        }
    };

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

                    <button
                        onClick={handleExport}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2 font-medium"
                    >
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
                            data={data.weekly.dailyItems}
                            totalDebt={data.weekly.netSleepDebt}
                            totalSurplus={data.weekly.netSleepSurplus}
                            percentChange={data.weekly.percentageChange}
                        />
                        <WeeklySleepTrendChart
                            data={data.monthly.weeklyItems}
                            averageHours={data.monthly.averageHoursSlept}
                            percentChange={data.monthly.percentageChange}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ReportsPage;
