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
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Log Your Sleep</h2>
                <p className="text-gray-600">Enter your sleep details below to track your sleep patterns.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6" aria-label="Sleep Input Form">
                <div>
                    <label htmlFor="sleep-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <DatePicker
                        id="sleep-date"
                        selected={selectedDate}
                        onChange={onDateChange}
                        dateFormat="MM/dd/yyyy"
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Duration</label>
                    <div className="flex space-x-4">
                        <input
                            type="number"
                            value={hoursValue}
                            onChange={(e) => onHoursChange(e.target.value)}
                            placeholder="Hours"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        <input
                            type="number"
                            value={minutesValue}
                            onChange={(e) => onMinutesChange(e.target.value)}
                            placeholder="Minutes"
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full border-gray-300 bg-white px-3 py-2 test-sm font-semibold text-gray-700 shadow-sm hover:border-blue-500 hover:text-blue-600"
                >
                    Log Sleep
                </button>
            </form>
        </div>
    );
}

export default SleepInputForm;