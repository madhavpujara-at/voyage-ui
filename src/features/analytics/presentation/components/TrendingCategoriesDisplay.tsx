import React from "react";
import { useAnalyticsContext } from "../contexts/AnalyticsContext";

// Note: In a real implementation, you would install and use a charting library like Recharts
// For this mock implementation, we'll create a simple CSS-based bar chart

export const TrendingCategoriesDisplay = () => {
    const { data, isLoading, error } = useAnalyticsContext();

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    Trending Categories
                </h2>
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
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
                    Trending Categories
                </h2>
                <p className="text-red-600">
                    Error loading data. Please try again later.
                </p>
            </div>
        );
    }

    const categories = data?.trendingCategories || [];

    // Find the maximum count to calculate relative bar widths
    const maxCount =
        categories.length > 0
            ? Math.max(...categories.map((cat) => cat.kudosCount))
            : 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Trending Categories
            </h2>
            {categories.length > 0 ? (
                <div className="space-y-4">
                    {categories.map((category) => {
                        // Calculate width percentage based on the max count
                        const widthPercentage =
                            maxCount > 0
                                ? Math.max(
                                      10,
                                      Math.round(
                                          (category.kudosCount / maxCount) * 100
                                      )
                                  )
                                : 0;

                        return (
                            <div
                                key={category.categoryName}
                                className="space-y-1"
                            >
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-800">
                                        {category.categoryName}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {category.kudosCount} kudos
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-5 border border-gray-200">
                                    <div
                                        className="bg-blue-700 h-5 rounded-full"
                                        style={{ width: `${widthPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-700">No category data available</p>
            )}
        </div>
    );
};
