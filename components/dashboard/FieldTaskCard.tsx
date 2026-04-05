import React from 'react';
import { cn } from '@/lib/utils';

export interface FieldTask {
  id: string;
  title: string;
  school: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'inspection' | 'intervention' | 'followup' | 'survey';
  dueDate?: string;
  description?: string;
  completed?: boolean;
}

interface FieldTaskCardProps {
  task: FieldTask;
  onComplete?: (id: string) => void;
  onStart?: (id: string) => void;
}

export function FieldTaskCard({
  task,
  onComplete,
  onStart,
}: FieldTaskCardProps) {
  const getTaskIcon = (type: string) => {
    const icons: Record<string, string> = {
      inspection: '●',
      intervention: '●',
      followup: '●',
      survey: '●',
    };
    return icons[type] || '●';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'border-red-200 bg-red-50';
      case 'MEDIUM':
        return 'border-amber-200 bg-amber-50';
      case 'LOW':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
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
    <div
      className={cn(
        'rounded-2xl border-2 p-4 transition-all',
        task.completed
          ? 'opacity-60 border-slate-200 bg-slate-50'
          : getPriorityColor(task.priority)
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{getTaskIcon(task.type)}</span>
          <div className="flex-1">
            <h4
              className={cn(
                'font-bold text-base leading-tight',
                task.completed ? 'line-through text-slate-600' : 'text-slate-900'
              )}
            >
              {task.title}
            </h4>
            <p className="text-sm text-slate-600 mt-1">{task.school}</p>
          </div>
        </div>
        <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', getPriorityBadge(task.priority))}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-slate-700 mb-3">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-slate-600 mb-3">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div className="flex gap-2 pt-3 border-t border-current border-opacity-10">
        {!task.completed && onStart && (
          <button
            onClick={() => onStart(task.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Start Task
          </button>
        )}
        {!task.completed && onComplete && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark Done
          </button>
        )}
        {task.completed && (
          <div className="flex-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg text-center">
            Completed
          </div>
        )}
      </div>
    </div>
  );
}
