import React from 'react';

interface ChartSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ChartSection({ title, description, children }: ChartSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
