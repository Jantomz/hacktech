import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function ChartsViewer() {
    const [budgetEntries, setBudgetEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();

    const handleDocumentProcessing = async () => {
        try {
            const response = await fetch("/api/docs-get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to process documents");
            }

            const data = await response.json();
            console.log("Document processing result:", data);
            setBudgetEntries(data.entries[0].budget_entries || []);
        } catch (error: any) {
            console.error("Error processing documents:", error);
            setError(error.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDocumentProcessing();
    }, []);

    if (loading) {
        return (
            <Card className="shadow-md">
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-budget-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-md">
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <p className="text-red-500 mb-2">{error}</p>
                            <p className="text-sm text-muted-foreground">
                                Make sure your VITE_ORKES_PAT environment
                                variable is set.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (budgetEntries.length === 0) {
        return (
            <Card className="shadow-md">
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-muted-foreground">
                            No chart data available.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Transform data for charts
    const top10Items = [...budgetEntries]
        .sort((a, b) => Math.abs(b.amount_usd) - Math.abs(a.amount_usd))
        .slice(0, 10)
        .map((entry) => ({
            name:
                entry.department +
                (entry.subcategory ? ` - ${entry.subcategory}` : ""),
            amount: entry.amount_usd,
        }));

    const departmentTotals = budgetEntries.reduce((acc: any, entry) => {
        const dept = entry.department || "Unknown";
        acc[dept] = (acc[dept] || 0) + (entry.amount_usd || 0);
        return acc;
    }, {});

    const departmentData = Object.keys(departmentTotals).map((dept) => ({
        name: dept,
        value: departmentTotals[dept],
    }));

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
                {/* Top 10 Budget Items Bar Chart */}
                <div className="h-[400px]">
                    <h3 className="text-lg font-medium mb-2">
                        Top 10 Budget Items
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={top10Items}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={120}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#0D9488" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Department Breakdown Pie Chart */}
                <div className="h-[400px]">
                    <h3 className="text-lg font-medium mb-2">
                        Budget by Department
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={departmentData}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                            >
                                {departmentData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            [
                                                "#0D9488",
                                                "#14B8A6",
                                                "#2DD4BF",
                                                "#5EEAD4",
                                                "#99F6E4",
                                                "#A7F3D0",
                                            ][index % 6]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value}`, "Amount"]}
                                contentStyle={{
                                    background: "#FFF",
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
