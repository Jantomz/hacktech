import React from "react";
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
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip 
            contentStyle={{ 
              background: "#FFF", 
              borderRadius: "8px", 
              border: "none", 
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
              padding: "8px"
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: 15, fontSize: '12px' }}
            iconSize={10}
          />
          <Line 
            type="monotone" 
            dataKey="planned" 
            stroke="#0D9488" 
            activeDot={{ r: 6 }} 
            strokeWidth={2}
            dot={{ r: 3 }} 
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ r: 3 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetLineChart;
