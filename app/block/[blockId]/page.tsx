'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useRole } from '@/components/providers/RoleProvider';
import { canAccessBlock } from '@/lib/auth';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { SchoolRiskTable } from '@/components/dashboard/SchoolRiskTable';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { ChartSection } from '@/components/dashboard/ChartSection';
import { getBlockById, getRecommendationsForSchool } from '@/lib/mockData';
import { School } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { Button } from '@/components/ui/button';

export default function BlockDashboard() {
  const { role, mounted } = useRole();
  const router = useRouter();
  const params = useParams();
  const blockId = params.blockId as string;
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  // Get block data BEFORE conditional returns
  const block = getBlockById(blockId);

  // Call all hooks BEFORE conditional returns
  const schoolTypeData = useMemo(() => {
    if (!block) return [];
    const primary = block.schools.filter(s => s.type === 'Primary').length;
    const secondary = block.schools.filter(s => s.type === 'Secondary').length;
    const combined = block.schools.filter(s => s.type === 'Combined').length;
    return [
      { name: 'Primary', value: primary },
      { name: 'Secondary', value: secondary },
      { name: 'Combined', value: combined },
    ];
  }, [block]);

  const infrastructureData = useMemo(() => {
    if (!block) return [];
    return block.schools.map(s => ({
      name: s.name.substring(0, 15),
      infrastructure: s.infrastructure_score,
      safety: s.safety_score,
      risk: s.riskScore,
    }));
  }, [block]);

  const recommendations = useMemo(() => {
    if (!selectedSchool || !block) return [];
    return getRecommendationsForSchool(selectedSchool.id, selectedSchool);
  }, [selectedSchool]);

  React.useEffect(() => {
    if (!mounted) return;
    
    const storedRole = sessionStorage.getItem('userRole');
    const hasAccess = canAccessBlock(role) || storedRole === 'BLOCK_OFFICER';
    
    if (!hasAccess) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [role, router, mounted]);

  if (!isAuthorized || !block) {
    return null;
  }

  // Calculate metrics
  const avgRiskScore = Math.round(
    block.schools.reduce((sum, s) => sum + s.riskScore, 0) / block.schools.length
  );
  const highRiskSchools = block.schools.filter(s => s.riskScore > 70);
  const totalStudents = block.schools.reduce((sum, s) => sum + s.totalStudents, 0);
  const totalGirls = block.schools.reduce((sum, s) => sum + s.girls, 0);
  const totalTeachers = block.schools.reduce((sum, s) => sum + s.teachers, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/block" className="text-blue-600 hover:text-blue-700 font-medium">
            ← All Blocks
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {block.name}
        </h1>
        <p className="text-slate-600 mt-2">
          {block.schools.length} schools • {totalStudents.toLocaleString()} students
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <RiskCard
          title="Block Risk Score"
          value={avgRiskScore}
          icon="⚠️"
          riskLevel={
            avgRiskScore > 70 ? 'high' : avgRiskScore > 50 ? 'medium' : 'low'
          }
        />
        <RiskCard
          title="Schools at Risk"
          value={highRiskSchools.length}
          unit=""
          icon="🏫"
          riskLevel={
            highRiskSchools.length > block.schools.length * 0.3 ? 'high' : 'medium'
          }
        />
        <RiskCard
          title="Total Students"
          value={totalStudents}
          unit=""
          icon="👥"
        />
        <RiskCard
          title="Girl Enrollment"
          value={Math.round((totalGirls / totalStudents) * 100)}
          icon="👧"
          riskLevel={
            (totalGirls / totalStudents) * 100 < 40 ? 'high' : 'low'
          }
        />
        <RiskCard
          title="Teacher-Student Ratio"
          value={Math.round(totalStudents / totalTeachers)}
          unit=":1"
          icon="👨‍🏫"
          riskLevel={
            totalStudents / totalTeachers > 40 ? 'high' : 'low'
          }
        />
      </div>

      {/* Schools Table and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SchoolRiskTable
            schools={block.schools}
            title={`Schools in ${block.name}`}
            onSchoolSelect={setSelectedSchool}
          />
        </div>

        {/* Selected School Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit sticky top-24">
          <h3 className="text-lg font-bold text-slate-900 mb-4">School Details</h3>

          {selectedSchool ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">School Name</p>
                <p className="text-sm font-medium text-slate-900">{selectedSchool.name}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Type & Location</p>
                <p className="text-sm text-slate-700">
                  {selectedSchool.type} • {selectedSchool.rural ? 'Rural' : 'Urban'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-200">
                <div>
                  <p className="text-xs text-slate-600">Students</p>
                  <p className="font-bold text-slate-900">{selectedSchool.totalStudents}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Teachers</p>
                  <p className="font-bold text-slate-900">{selectedSchool.teachers}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Girls</p>
                  <p className="font-bold text-slate-900">{selectedSchool.girls}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Girls Toilet</p>
                  <p className="font-bold text-slate-900">
                    {selectedSchool.girls_sanitation ? '✓' : '✗'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Risk Score</p>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      selectedSchool.riskScore > 70
                        ? 'bg-red-500'
                        : selectedSchool.riskScore > 50
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${selectedSchool.riskScore}%` }}
                  />
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {selectedSchool.riskScore}/100
                </p>
              </div>

              {selectedSchool.interventionNeeded.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    Interventions Needed
                  </p>
                  <ul className="space-y-1">
                    {selectedSchool.interventionNeeded.map((intervention, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 flex items-start gap-2"
                      >
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-600 text-sm">
              Select a school from the table to view details and recommendations
            </p>
          )}
        </div>
      </div>

      {/* Recommendations for Selected School */}
      {selectedSchool && recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            AI Recommendations for {selectedSchool.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(rec => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onAssign={(id) => console.log('Assigned:', id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Infrastructure Analysis */}
      <ChartSection
        title="Infrastructure & Safety Scores by School"
        description="Comparative analysis of infrastructure and safety metrics"
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={infrastructureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="infrastructure" fill="#3b82f6" name="Infrastructure Score" />
            <Bar dataKey="safety" fill="#10b981" name="Safety Score" />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* School Type Distribution */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">School Type Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {schoolTypeData.map(type => (
            <div key={type.name} className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{type.value}</p>
              <p className="text-sm text-slate-600 mt-1">{type.name} Schools</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
