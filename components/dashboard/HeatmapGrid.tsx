import React from 'react';
import { BlockComparisonData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface HeatmapGridProps {
  data: BlockComparisonData[];
  title?: string;
}

export function HeatmapGrid({ data, title = 'Block Risk Comparison' }: HeatmapGridProps) {
  const getRiskColor = (score: number): string => {
    if (score >= 70) return 'bg-red-500 text-white';
    if (score >= 50) return 'bg-amber-400 text-slate-900';
    if (score >= 30) return 'bg-yellow-300 text-slate-900';
    return 'bg-green-400 text-white';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3>
      
      <div className="space-y-3">
        {data.map((block) => (
          <div key={block.blockId} className="flex items-center gap-4">
            <div className="w-24 flex-shrink-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {block.blockName}
              </p>
            </div>
            
            <div className="flex-1">
              <div className="flex h-12 gap-1 rounded-lg overflow-hidden bg-slate-100">
                <div
                  className={cn(
                    'flex items-center justify-center font-bold text-sm transition-all',
                    getRiskColor(block.riskScore)
                  )}
                  style={{ width: `${block.riskScore}%` }}
                >
                  {block.riskScore}
                </div>
              </div>
            </div>

            <div className="w-32 text-right">
              <p className="text-xs text-slate-600">
                {block.schoolsAtRisk}/{block.totalSchools} at risk
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-400" />
          <span className="text-xs text-slate-600">Low Risk {'(<30)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-yellow-300" />
          <span className="text-xs text-slate-600">Moderate (30-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-400" />
          <span className="text-xs text-slate-600">High (50-70)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-red-500" />
          <span className="text-xs text-slate-600">Critical {'(>70)'}</span>
        </div>
      </div>
    </div>
  );
}
