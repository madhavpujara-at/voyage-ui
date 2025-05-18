import React from "react";
import { useAnalyticsContext } from "../contexts/AnalyticsContext";

export const PeriodFilter = () => {
    const { period, setPeriod } = useAnalyticsContext();

    const handlePeriodChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setPeriod(event.target.value);
    };

    return (
        <div className="mb-6">
            <label
                htmlFor="period-select"
                className="block text-sm font-semibold mb-2 text-gray-800"
            >
                Time Period
            </label>
            <select
                id="period-select"
                value={period}
                onChange={handlePeriodChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 max-w-xs shadow-sm"
            >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
            </select>
        </div>
    );
};
