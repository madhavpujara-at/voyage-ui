import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../../components/layouts/AdminLayout";
import { useAuth } from "../../../../contexts/AuthContext";
import Navigation from "../../../../components/organisms/Navigation";
import { AnalyticsProvider } from "../contexts/AnalyticsProvider";
import { PeriodFilter } from "../components/PeriodFilter";
import { TopRecognitionsCard } from "../components/TopRecognitionsCard";
import { TrendingWordsDisplay } from "../components/TrendingWordsDisplay";
import { TrendingCategoriesDisplay } from "../components/TrendingCategoriesDisplay";

export const AnalyticsTemplate: React.FC = () => {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        // If authentication is still loading, wait
        if (loading) return;

        // If user is not authenticated, redirect to login
        if (!user) {
            router.replace("/login");
            return;
        }

        // No role check anymore - everyone can access
        setIsPageLoading(false);
    }, [user, loading, router]);

    if (loading || isPageLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-700 font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <AdminLayout username={user.name} onLogout={logout}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-700 text-lg">
                    Track kudos metrics and engagement across your organization
                </p>
            </div>

            <Navigation />

            <div className="py-8">
                <AnalyticsProvider>
                    <div className="mb-8">
                        <PeriodFilter />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <TopRecognitionsCard
                            title="Top Recognized Individuals"
                            dataType="individuals"
                        />
                        <TopRecognitionsCard
                            title="Top Recognized Teams"
                            dataType="teams"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TrendingWordsDisplay />
                        <TrendingCategoriesDisplay />
                    </div>
                </AnalyticsProvider>
            </div>
        </AdminLayout>
    );
};
