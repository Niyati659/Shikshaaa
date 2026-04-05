'use client';

import React, { useState, useMemo } from 'react';
import { School } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SchoolRiskTableProps {
  schools: School[];
  title?: string;
  onSchoolSelect?: (school: School) => void;
}

export function SchoolRiskTable({
  schools,
  title = 'High-Risk Schools',
  onSchoolSelect,
}: SchoolRiskTableProps) {
  const [sortKey, setSortKey] = useState<'risk' | 'name' | 'students'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedSchools = useMemo(() => {
    const sorted = [...schools].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortKey) {
        case 'risk':
          aVal = a.riskScore;
          bVal = b.riskScore;
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'students':
          aVal = a.totalStudents;
          bVal = b.totalStudents;
          break;
      }

      const comparison = aVal > bVal ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [schools, sortKey, sortOrder]);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const toggleSort = (key: 'risk' | 'name' | 'students') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">
          {sortedSchools.length} school{sortedSchools.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('name')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  School Name
                  {sortKey === 'name' && (
                    <span className="text-slate-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left hidden sm:table-cell">
                <button
                  onClick={() => toggleSort('students')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  Students
                  {sortKey === 'students' && (
                    <span className="text-slate-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => toggleSort('risk')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  Risk Score
                  {sortKey === 'risk' && (
                    <span className="text-slate-400">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSchools.map((school) => (
              <tr
                key={school.id}
                onClick={() => onSchoolSelect?.(school)}
                className={cn(
                  'border-b border-slate-100 transition-colors',
                  onSchoolSelect ? 'hover:bg-blue-50 cursor-pointer' : ''
                )}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">
                      {school.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {school.type} • {school.rural ? 'Rural' : 'Urban'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <div className="text-sm text-slate-600">
                    {school.totalStudents}
                    <div className="text-xs text-slate-500 mt-0.5">
                      {school.girls}👧 {school.boys}👦
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={cn('px-3 py-1 rounded-full font-semibold text-sm inline-block', getRiskColor(school.riskScore))}>
                    {school.riskScore}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
