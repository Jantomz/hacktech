import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ChartsViewer() {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
const fetchChartData = async () => {
  try {
    const response = await fetch(
      "https://developer.orkescloud.com/api/workflow/oqwede8f97bd-231e-11f0-9477-2ebdeb26eda5?includeTasks=true&summarize=false",
      {
        headers: {
          accept: "*/*",
          // ✅ Vite exposes env vars on import.meta.env
          "X-Authorization": import.meta.env.VITE_ORKES_PAT ?? "",
          // if the Orkes API expects a Bearer token instead, use:
          // Authorization: `Bearer ${import.meta.env.VITE_ORKES_PAT ?? ""}`,
        },
      }
    );
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      console.log(response);

      const data = await response.json();
      setSpecs(data.output?.graphs || []);
      } catch (err) {
      console.error("Error fetching chart data:", err);
      setError("Failed to load chart data. Please check your API key.");
      } finally {
      setLoading(false);
      }
    };

    fetchChartData();
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
    console.log("error", error)
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-sm text-muted-foreground">Make sure your VITE_ORKES_PAT environment variable is set.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (specs.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No chart data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Budget Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8">
          {specs.map((g, i) =>
            g.chartType === "BarChart" ? (
              <div key={i} className="h-[320px]">
                <h3 className="text-lg font-medium mb-2">{g.title}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={g.data}>
                    <XAxis dataKey={g.xKey} label={{ value: g.xLabel, position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: g.yLabel, angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{ background: "#FFF", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    />
                    <Legend />
                    <Bar dataKey={g.yKey} fill="#0D9488" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div key={i} className="h-[320px]">
                <h3 className="text-lg font-medium mb-2">{g.title}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={g.data} 
                      dataKey="value" 
                      nameKey="name" 
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                    >
                      {g.data.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={["#0D9488", "#14B8A6", "#2DD4BF", "#5EEAD4", "#99F6E4", "#A7F3D0"][index % 6]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}`, "Amount"]}
                      contentStyle={{ background: "#FFF", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
