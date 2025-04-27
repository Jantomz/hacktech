import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Sample data
const data = [
  { name: "Housing", value: 35 },
  { name: "Food", value: 20 },
  { name: "Transportation", value: 15 },
  { name: "Utilities", value: 10 },
  { name: "Entertainment", value: 10 },
  { name: "Healthcare", value: 5 },
  { name: "Other", value: 5 },
];

const COLORS = [
  "#0D9488", // Teal
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#6B7280", // Gray
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  // Only show labels for segments that are large enough (>8%)
  if (percent < 0.08) return null;
  
  const RADIAN = Math.PI / 180;
  // Position labels farther from the center
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Change text color based on position for better visibility
  const textAnchor = x > cx ? 'start' : 'end';
  
  return (
    <text 
      x={x} 
      y={y} 
      fill={COLORS[index % COLORS.length]}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const BudgetPieChart = () => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart
          margin={{
            top: 15,
            right: 15,
            left: 15,
            bottom: 25,
          }}
        >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={55}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${value}%`}
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
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 15, fontSize: '12px' }}
            iconSize={10}
            formatter={(value, entry, index) => (
              <span style={{ color: COLORS[index % COLORS.length], fontWeight: 500 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetPieChart;
