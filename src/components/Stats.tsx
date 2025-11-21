import type React from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { ActivityData, Post } from "../types";

interface StatsProps {
  posts: Post[];
}

const Stats: React.FC<StatsProps> = ({ posts }) => {
  const hourData: ActivityData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0,
  }));

  posts.forEach((post) => {
    const hour = post.date.getHours();
    hourData[hour].count++;
  });

  const colors = [
    "#ffb7b2",
    "#ff9aa2",
    "#e2f0cb",
    "#b5ead7",
    "#c7ceea",
    "#ffdac1",
  ];

  return (
    <div className="w-full h-full bg-white/40 p-6 rounded-3xl border border-white shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-bold text-lg flex items-center gap-2">
          <span className="bg-kawaii-yellow p-1 rounded-md">📊</span>
          Activity Vibe
        </h3>
        <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
          JST Time
        </span>
      </div>

      <div className="flex-grow w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourData}>
            <XAxis
              dataKey="hour"
              tickFormatter={(val) => `${val}`}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.4)" }}
              contentStyle={{
                borderRadius: "16px",
                border: "2px solid #fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "#666",
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {hourData.map((entry) => (
                <Cell
                  key={`cell-hour-${entry.hour}`}
                  fill={colors[entry.hour % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
