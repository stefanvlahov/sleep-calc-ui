import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SleepInputFormProps {
    hoursValue: string;
    minutesValue: string;
    onHoursChange: (value: string) => void;
    onMinutesChange: (value: string) => void;
    onSubmit: () => Promise<void>;
    selectedDate: Date;
    onDateChange: (date: Date | null) => void;
}

function SleepInputForm({
                            hoursValue,
                            minutesValue,
                            onHoursChange,
                            onMinutesChange,
                            onSubmit,
                            selectedDate,
                            onDateChange,
                        }: SleepInputFormProps) {

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void onSubmit();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-md mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Log Your Sleep</h2>
                <p className="text-gray-600 mt-2">Enter your sleep details below to track your patterns.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6" aria-label="Sleep Input Form">
                <div>
                    <label htmlFor="sleep-date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <DatePicker
                            id="sleep-date"
                            selected={selectedDate}
                            onChange={onDateChange}
                            dateFormat="MM/dd/yyyy"
                            className="w-full pl-10 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Duration</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Hours</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="number"
                                    value={hoursValue}
                                    onChange={(e) => onHoursChange(e.target.value)}
                                    placeholder="8"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="number"
                                    value={minutesValue}
                                    onChange={(e) => onMinutesChange(e.target.value)}
                                    placeholder="e.g., 30"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-3 rounded-md text-sm font-semibold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Log Sleep
                </button>
            </form>
        </div>
    );
}

export default SleepInputForm;