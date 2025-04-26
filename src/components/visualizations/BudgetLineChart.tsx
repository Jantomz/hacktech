
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample data
const data = [
  {
    month: "Jan",
    planned: 100,
    actual: 110,
  },
  {
    month: "Feb",
    planned: 200,
    actual: 190,
  },
  {
    month: "Mar",
    planned: 300,
    actual: 310,
  },
  {
    month: "Apr",
    planned: 400,
    actual: 405,
  },
  {
    month: "May",
    planned: 500,
    actual: 510,
  },
  {
    month: "Jun",
    planned: 600,
    actual: 580,
  },
  {
    month: "Jul",
    planned: 700,
    actual: 690,
  },
  {
    month: "Aug",
    planned: 800,
    actual: 830,
  },
  {
    month: "Sep",
    planned: 900,
    actual: 910,
  },
  {
    month: "Oct",
    planned: 1000,
    actual: 980,
  },
  {
    month: "Nov",
    planned: 1100,
    actual: 1080,
  },
  {
    month: "Dec",
    planned: 1200,
    actual: 1190,
  },
];

const BudgetLineChart = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Planned vs Actual Spending (in thousands $)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ background: "#FFF", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#0D9488" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="actual" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetLineChart;
