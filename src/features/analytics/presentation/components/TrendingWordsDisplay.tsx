import React from "react";
import { useAnalyticsContext } from "../contexts/AnalyticsContext";

export const TrendingWordsDisplay = () => {
    const { data, isLoading, error } = useAnalyticsContext();

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    Trending Words
                </h2>
                <div className="animate-pulse flex flex-wrap gap-2">
                    {[...Array(7)].map((_, index) => (
                        <div
                            key={index}
                            className="h-8 bg-gray-200 rounded-full w-20"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    Trending Words
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
                Trending Words
            </h2>
            {data?.trendingWords && data.trendingWords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {data.trendingWords.map((wordData) => {
                        // Calculate size based on frequency - larger frequency means larger tag
                        const sizeClass =
                            wordData.frequency > 200
                                ? "text-xl"
                                : wordData.frequency > 100
                                ? "text-lg"
                                : wordData.frequency > 50
                                ? "text-base"
                                : "text-sm";

                        return (
                            <span
                                key={wordData.word}
                                className={`${sizeClass} bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block font-medium`}
                            >
                                {wordData.word}
                            </span>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-700">No trending words available</p>
            )}
        </div>
    );
};
