
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample data
const data = [
  {
    name: "2020",
    Revenue: 120,
    Expenses: 110,
    amt: 120,
  },
  {
    name: "2021",
    Revenue: 132,
    Expenses: 130,
    amt: 132,
  },
  {
    name: "2022",
    Revenue: 141,
    Expenses: 137,
    amt: 141,
  },
  {
    name: "2023",
    Revenue: 154,
    Expenses: 148,
    amt: 154,
  },
  {
    name: "2024",
    Revenue: 162,
    Expenses: 153,
    amt: 162,
  },
  {
    name: "2025",
    Revenue: 170,
    Expenses: 165,
    amt: 170,
  },
];

const BudgetBarChart = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Budget Trends Over Time (in millions $)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ background: "#FFF", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              />
              <Legend />
              <Bar dataKey="Revenue" fill="#0D9488" />
              <Bar dataKey="Expenses" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetBarChart;
