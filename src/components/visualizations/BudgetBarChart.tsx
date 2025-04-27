import React from "react";
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
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
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
            dataKey="name" 
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
          <Bar dataKey="Revenue" fill="#0D9488" barSize={20} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#F59E0B" barSize={20} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetBarChart;
