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

    useEffect(() => {
        getDocumentData();
    }, []);

    const userId =
        user?.id || new URLSearchParams(window.location.search).get("userId");

    if (!userId) {
        setError("User ID is missing");
        setLoading(false);
        return;
    }

    const getDocumentData = async () => {
        try {
            const response = await fetch("/api/docs-get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: userId }),
            });

            if (!response.ok) {
                throw new Error("Failed to process documents");
            }

            const data = await response.json();
            console.log("Document processing result:", data);
            setBudgetEntries(data.entries[0].budget_entries || []);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error processing documents:", error.message);
                setError(error.message);
            } else {
                console.error("Error processing documents:", error);
                setError("An unknown error occurred");
            }
            setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

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
                            <p className="text-lg text-muted-foreground">
                                No data to read! Please upload documents through the Data Hub tab above.
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

    // Bottom 10 (smallest absolute $ items)
    const bottom10Items = [...budgetEntries]
    .sort((a, b) => Math.abs(a.amount_usd) - Math.abs(b.amount_usd))
    .slice(0, 10)
    .map((entry) => ({
      name:
        entry.department +
        (entry.subcategory ? ` - ${entry.subcategory}` : ""),
      amount: entry.amount_usd,
    }));

    const departmentTotals = budgetEntries.reduce(
        (acc: Record<string, number>, entry) => {
            const dept = entry.department || "Unknown";
            acc[dept] = (acc[dept] || 0) + (entry.amount_usd || 0);
            return acc;
        },
        {}
    );

    const departmentData = Object.keys(departmentTotals).map((dept) => ({
        name: dept,
        value: departmentTotals[dept],
    }));

    // New: Categorize budget entries into spending categories
    const categorizeEntry = (entry) => {
        const textToCheck = `${entry.subcategory || ''} ${entry.purpose || ''}`.toLowerCase();
        
        if (textToCheck.includes('teacher') || textToCheck.includes('literacy') || 
            textToCheck.includes('esl') || textToCheck.includes('math') || 
            textToCheck.includes('educator') || textToCheck.includes('early college') || 
            textToCheck.includes('student success')) {
            return 'Education';
        } 
        else if (textToCheck.includes('secretary') || textToCheck.includes('program manager') || 
                textToCheck.includes('communications') || textToCheck.includes('outreach')) {
            return 'Administration';
        }
        else if (textToCheck.includes('telehealth') || textToCheck.includes('psychologist') || 
                textToCheck.includes('social worker') || textToCheck.includes('health')) {
            return 'Health & Wellness';
        }
        else if (textToCheck.includes('epp') || textToCheck.includes('tuition') || 
                textToCheck.includes('career pathways')) {
            return 'Professional Development';
        }
        else if (textToCheck.includes('paraprofessional') || textToCheck.includes('special education') || 
                textToCheck.includes('youth guidance')) {
            return 'Support Services';
        }
        else if (textToCheck.includes('partner organization') || textToCheck.includes('resource group') || 
                textToCheck.includes('school council')) {
            return 'Community Programs';
        }
        return 'Other';
    };

    // Calculate category totals
    const categoryTotals = budgetEntries.reduce((acc, entry) => {
        const category = categorizeEntry(entry);
        if (!acc[category]) acc[category] = 0;
        acc[category] += entry.amount_usd || 0;
        return acc;
    }, {});

    // Format for chart
    const spendingCategoriesData = Object.entries(categoryTotals)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // Calculate percentages
    const totalBudget = spendingCategoriesData.reduce((sum, item) => sum + (item.value as number), 0);
    const spendingCategoriesWithPercentage = spendingCategoriesData.map(item => ({
        ...item,
        percentage: Math.round((item.value as number / totalBudget) * 100)
    }));

    // Colors for spending categories
    const categoryColors = [
        "#3B8686", // teal
        "#4668B4", // steel blue
        "#F0AD4E", // orange
        "#E74C3C", // red
        "#8E44AD", // purple
        "#5CB85C", // green
        "#777777"  // gray
    ];

    /* …imports & state unchanged … */

return (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle>Budget Analysis</CardTitle>
    </CardHeader>

    <CardContent className="flex flex-col space-y-32">
      {/* ─────── Spending-Categories donut ─────── */}
      <div className="h-[500px] flex flex-col">
        <h3 className="text-lg font-medium mb-2">Spending Categories</h3>
        <p className="text-sm text-muted-foreground mb-4">Budget distribution</p>

        <ResponsiveContainer width="100%" height="100%">
          {/* 👇 NEW margin prop gives space for labels & legend */}
          <PieChart margin={{ top: 30, right: 40, bottom: 40, left: 40 }}>
            <Pie
              data={spendingCategoriesWithPercentage}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              /* 👇 Make the labels orbit farther out */
              label={({ cx, cy, midAngle, outerRadius, percent, index }) => {
                const RAD = Math.PI / 180;
                const radius = outerRadius * 2;      // was 1.4
                const x = cx + radius * Math.cos(-midAngle * RAD);
                const y = cy + radius * Math.sin(-midAngle * RAD);

                return (
                  <text
                    x={x}
                    y={y}
                    fill={categoryColors[index % categoryColors.length]}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontWeight="bold"
                  >
                    {`${Math.round(percent * 100)}%`}
                  </text>
                );
              }}
            >
              {spendingCategoriesWithPercentage.map((_, i) => (
                <Cell key={i} fill={categoryColors[i % categoryColors.length]} />
              ))}
            </Pie>

            {/* keep legend but the margin above stops overlap */}
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            <Tooltip
              formatter={(v) => [`$${v.toLocaleString()}`, "Amount"]}
              contentStyle={{
                background: "#FFF",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ─────── Top-10 bar chart ─────── */}
      <div className="h-[400px]">
  <h3 className="text-lg font-medium mb-2">Top 10 Budget Items</h3>

  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={top10Items}
      /* 👇 give the legend some real estate inside the chart */
      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="name"
        angle={-30}
        textAnchor="end"
        interval={0}
        height={110}
        tickMargin={16}
        /* 👇 strip any leading numbers + dash/space */
        tickFormatter={(v: string) =>
          v.replace(/^\s*\d+\s*[-–]\s*/, "").trim()
        }
      />

      <YAxis />
      <Tooltip />
      {/* 👇 drop the legend lower with wrapperStyle */}
      <Bar dataKey="amount" fill="#0D9488" />
    </BarChart>
  </ResponsiveContainer>
  {/* custom legend just below the chart */}
<div className="mt-6 flex justify-center items-center space-x-2">
  {/* the coloured square */}
  <span
    className="inline-block w-4 h-4 rounded-sm"
    style={{ backgroundColor: "#0D9488" }}
  />
  {/* the label */}
  <span className="font-medium text-budget-primary">amount</span>
</div>

  </div>

      {/* ─────── Department pie stays the same ─────── */}

                {/* Bottom 10 Budget Items Bar Chart */}
                <div className="h-[400px]">
  <h3 className="text-lg font-medium mb-2">Bottom 10 Budget Items</h3>

  <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={bottom10Items}
    margin={{ top: 20, right: 30, left: 20, bottom: 140 }} // smaller margin now
  >
    <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="name"
        angle={-30}
        textAnchor="end"
        interval={0}
        height={110}
        tickMargin={16}
        /* 👇 strip any leading numbers + dash/space */
        tickFormatter={(v: string) =>
          v.replace(/^\s*\d+\s*[-–]\s*/, "").trim()
        }
      />

      <YAxis />
      <Tooltip />
      {/* 👇 drop the legend lower with wrapperStyle */}
      
      <Bar dataKey="amount" fill="#0D9488" />
    </BarChart>
  </ResponsiveContainer>
{/* custom legend just below the chart */}
<div className="mt-6 flex justify-center items-center space-x-2">
  {/* the coloured square */}
  <span
    className="inline-block w-4 h-4 rounded-sm"
    style={{ backgroundColor: "#0D9488" }}
  />
  {/* the label */}
  <span className="font-medium text-budget-primary">amount</span>
</div>

</div>

                {/* ─────── Department Breakdown Pie Chart ─────── */}
<div className="h-[400px]">
  <h3 className="text-lg font-medium mb-2">Budget by Department</h3>

  <ResponsiveContainer width="100%" height="100%">
    <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 40 }}>
      <Pie
        data={departmentData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {departmentData.map((_, i) => (
          <Cell
            key={i}
            fill={
              [
                "#0D9488", // teal-green
                "#14B8A6",
                "#2DD4BF",
                "#5EEAD4",
                "#99F6E4",
                "#A7F3D0",
              ][i % 6]
            }
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(v) => [`$${(+v).toLocaleString()}`, "Amount"]}
        contentStyle={{
          background: "#FFF",
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)",
        }}
      />
      {/* ⬆ keep Tooltip inside — legend handled below */}
    </PieChart>
  </ResponsiveContainer>

  {/* custom legend BELOW the chart */}
  <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm max-w-full overflow-hidden">
    {departmentData.map((dept, i) => (
      <div key={dept.name} className="flex items-center space-x-2">
        <span
          className="inline-block w-4 h-4 rounded-sm"
          style={{
            backgroundColor:
              [
                "#0D9488",
                "#14B8A6",
                "#2DD4BF",
                "#5EEAD4",
                "#99F6E4",
                "#A7F3D0",
              ][i % 6],
          }}
        />
        <span className="text-muted-foreground">{dept.name}</span>
      </div>
    ))}
  </div>
</div>
            </CardContent>
        </Card>
    );
}
