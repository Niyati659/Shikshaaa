import React from 'react';
import { Recommendation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAssign?: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  onAssign,
}: RecommendationCardProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Infrastructure': '●',
      'Gender-Safety': '●',
      'Nutrition': '●',
      'Teacher': '●',
      'Enrollment': '●',
    };
    return icons[category] || '●';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-700';
      case 'LOW':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">
            {getCategoryIcon(recommendation.category)}
          </span>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 text-sm leading-tight">
              {recommendation.action}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              {recommendation.category}
            </p>
          </div>
        </div>
        <Badge className={cn('font-semibold', getPriorityColor(recommendation.priority))}>
          {recommendation.priority}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1">Reasoning</p>
          <p className="text-sm text-slate-700">
            {recommendation.reasoning}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1">Expected Impact</p>
          <p className="text-sm text-slate-700">
            {recommendation.estimatedImpact}
          </p>
        </div>
      </div>

      {onAssign && (
        <button
          onClick={() => onAssign(recommendation.id)}
          className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Assign Action
        </button>
      )}
    </div>
  );
}
