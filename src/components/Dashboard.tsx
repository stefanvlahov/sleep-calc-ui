import Layout from "./Layout";

interface SleepEntry {
    date: string;
    hoursSlept: number;
    target: number;
    debtSurplus: number;
}

function Dashboard() {
    // Mock data - replace with actual API calls
    const overallDebt = -12.5;
    const overallSurplus = 8.0;
    const sevenDayAverage = 7.2;

    const recentEntries: SleepEntry[] = [
        { date: "2024-07-20", hoursSlept: 7.0, target: 7.5, debtSurplus: -0.5 },
        { date: "2024-07-19", hoursSlept: 8.0, target: 7.5, debtSurplus: 0.5 },
        { date: "2024-07-18", hoursSlept: 6.5, target: 7.5, debtSurplus: -1.0 },
        { date: "2024-07-17", hoursSlept: 9.0, target: 7.5, debtSurplus: 1.5 },
        { date: "2024-07-16", hoursSlept: 7.5, target: 7.5, debtSurplus: 0.0 },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sleep Dashboard</h1>
                        <p className="text-gray-600 mt-1">Welcome back, let's check your sleep patterns.</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2">
                        <span className="text-xl">+</span>
                        Log New Sleep
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Sleep Debt</h3>
                        <p className="text-3xl font-bold text-red-500">{overallDebt} hours</p>
                        <p className="text-xs text-gray-500 mt-2">Below target sleep</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Sleep Surplus</h3>
                        <p className="text-3xl font-bold text-green-500">{overallSurplus} hours</p>
                        <p className="text-xs text-gray-500 mt-2">Above target sleep</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">7-Day Average</h3>
                        <p className="text-3xl font-bold text-gray-900">{sevenDayAverage} hours</p>
                        <p className="text-xs text-gray-500 mt-2">Slightly below target</p>
                    </div>
                </div>

                {/* Recent Sleep Entries Table */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Sleep Entries</h2>
                        <a href="#" className="text-sm text-blue-500 hover:underline">View all</a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        DATE
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        HOURS SLEPT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        TARGET
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        DEBT/SURPLUS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentEntries.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {entry.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {entry.hoursSlept.toFixed(1)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {entry.target.toFixed(1)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={entry.debtSurplus >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                                {entry.debtSurplus > 0 ? '+' : ''}{entry.debtSurplus.toFixed(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
