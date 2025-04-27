import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from "recharts";

// Sample data
const data = [
  { category: "Housing", planned: 35, actual: 40 },
  { category: "Food", planned: 20, actual: 22 },
  { category: "Transportation", planned: 15, actual: 12 },
  { category: "Utilities", planned: 10, actual: 10 },
  { category: "Entertainment", planned: 10, actual: 15 },
  { category: "Healthcare", planned: 5, actual: 4 },
  { category: "Other", planned: 5, actual: 7 },
];

const BudgetRadarChart = () => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="80%" 
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 25,
          }}
        >
          <PolarGrid 
            gridType="polygon"
            strokeOpacity={0.15}
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 'auto']}
            tickCount={5}
            stroke="#e5e7eb"
            tick={{ fill: '#6B7280', fontSize: 10 }}
          />
          <Radar
            name="Planned"
            dataKey="planned"
            stroke="#0D9488"
            fill="#0D9488"
            fillOpacity={0.4}
            dot={{ r: 3, fill: "#0D9488" }}
            activeDot={{ r: 5, fill: "#0D9488" }}
          />
          <Radar
            name="Actual"
            dataKey="actual"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.4}
            dot={{ r: 3, fill: "#3B82F6" }}
            activeDot={{ r: 5, fill: "#3B82F6" }}
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
            formatter={(value) => `$${value}`}
          />
          <Legend 
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 15, fontSize: '12px' }}
            iconSize={10}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetRadarChart; 