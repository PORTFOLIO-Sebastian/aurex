'use client'

import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color: string;
}

import React from 'react';

function SparklineComponent({ data, color }: SparklineProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((value, index) => ({ value, index }));

  // Min and max for domain to make the line fill the space vertically better
  const min = Math.min(...data);
  const max = Math.max(...data);

  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={[min, max]} hide />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const Sparkline = React.memo(SparklineComponent);
export default Sparkline;
