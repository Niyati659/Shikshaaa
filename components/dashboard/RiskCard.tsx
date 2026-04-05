import React from 'react';
import { cn } from '@/lib/utils';

interface RiskCardProps {
  title: string;
  value: number;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  riskLevel?: 'low' | 'medium' | 'high';
  trend?: number; // percentage change
}

export function RiskCard({
  title,
  value,
  unit = '%',
  description,
  icon,
  riskLevel,
  trend,
}: RiskCardProps) {
  // Determine risk level color
  let bgColor = 'bg-pink-50 border-pink-200';
  let valueColor = 'text-pink-600';
  let badgeColor = 'bg-pink-100 text-pink-700';

  if (riskLevel === 'high') {
    bgColor = 'bg-red-50 border-red-200';
    valueColor = 'text-red-600';
    badgeColor = 'bg-red-100 text-red-700';
  } else if (riskLevel === 'medium') {
    bgColor = 'bg-amber-50 border-amber-200';
    valueColor = 'text-amber-600';
    badgeColor = 'bg-amber-100 text-amber-700';
  } else if (riskLevel === 'low') {
    bgColor = 'bg-green-50 border-green-200';
    valueColor = 'text-green-600';
    badgeColor = 'bg-green-100 text-green-700';
  }

  return (
    <div className={cn('rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow', bgColor)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className={cn('text-3xl font-bold', valueColor)}>
              {value}
            </span>
            <span className="text-lg text-slate-500">{unit}</span>
          </div>
        </div>
        {icon && (
          <div className="text-3xl opacity-70">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="text-sm text-slate-600 mb-3">
          {description}
        </p>
      )}

      <div className="flex items-center justify-between">
        {trend !== undefined && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend > 0
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          )}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </span>
        )}
        {riskLevel && (
          <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', badgeColor)}>
            {riskLevel.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
