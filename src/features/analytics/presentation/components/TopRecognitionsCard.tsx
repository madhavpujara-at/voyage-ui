import React from "react";
import { useAnalyticsContext } from "../contexts/AnalyticsContext";
import { RecognitionStatDto } from "../../application/dtos/RecognitionStatDto";

interface TopRecognitionsCardProps {
    title: string;
    dataType: "individuals" | "teams";
}

export const TopRecognitionsCard: React.FC<TopRecognitionsCardProps> = ({
    title,
    dataType,
}) => {
    const { data, isLoading, error } = useAnalyticsContext();

    // Determine which data to display based on dataType
    const recognitionData: RecognitionStatDto[] | undefined = data
        ? dataType === "individuals"
            ? data.topIndividuals
            : data.topTeams
        : undefined;

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    {title}
                </h2>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    {title}
                </h2>
                <p className="text-red-600">
                    Error loading data. Please try again later.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {title}
            </h2>
            {recognitionData && recognitionData.length > 0 ? (
                <div className="space-y-4">
                    {recognitionData.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <span className="font-medium text-gray-800">
                                    {item.name}
                                </span>
                            </div>
                            <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                                {item.kudosCount} kudos
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700">No data available</p>
            )}
        </div>
    );
};
