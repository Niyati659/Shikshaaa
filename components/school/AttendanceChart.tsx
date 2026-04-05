'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AttendanceRecord } from '@/lib/types';

interface AttendanceChartProps {
  records: AttendanceRecord[];
}

export function AttendanceChart({ records }: AttendanceChartProps) {
  // Get last 30 days of data
  const last30Days = records.slice(-30).map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    attendance: Math.round((record.totalPresent / (record.totalPresent + record.totalAbsent)) * 100),
    boys: record.boysPresentPercentage,
    girls: record.girlsPresentPercentage,
  }));

  return (
    <div className="w-full h-80 bg-slate-900 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">30-Day Attendance Trend</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={last30Days}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="attendance" 
            stroke="#EC4899" 
            dot={false}
            name="Overall Attendance %"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="boys" 
            stroke="#60A5FA" 
            dot={false}
            name="Boys %"
            strokeWidth={1.5}
            opacity={0.7}
          />
          <Line 
            type="monotone" 
            dataKey="girls" 
            stroke="#A78BFA" 
            dot={false}
            name="Girls %"
            strokeWidth={1.5}
            opacity={0.7}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
