'use client';

import React, { useMemo } from 'react';
import { useRole } from '@/components/providers/RoleProvider';
import { canAccessBlock } from '@/lib/auth';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { HeatmapGrid } from '@/components/dashboard/HeatmapGrid';
import { SchoolRiskTable } from '@/components/dashboard/SchoolRiskTable';
import { ChartSection } from '@/components/dashboard/ChartSection';
import {
  getMockDistrict,
  getBlockComparisonData,
  getTrendData,
  getTeacherDistributionData,
  getDBTData,
  getEquityComparisonData,
} from '@/lib/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useRouter } from 'next/navigation';

export default function DistrictDashboard() {
  const { role, mounted } = useRole();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  // Get data and call all hooks BEFORE conditional returns
  const district = getMockDistrict();
  const blockComparison = getBlockComparisonData(district);
  const trendData = getTrendData();
  const teacherData = getTeacherDistributionData();
  const dbtData = getDBTData();
  const equityData = getEquityComparisonData();

  // Get all schools for the table
  const allSchools = useMemo(
    () => district.blocks.flatMap(b => b.schools).sort((a, b) => b.riskScore - a.riskScore),
    [district]
  );

  React.useEffect(() => {
    if (!mounted) return;
    
    // Check both the role context and sessionStorage
    const storedRole = sessionStorage.getItem('userRole');
    const hasAccess = canAccessBlock(role) || storedRole === 'BLOCK_OFFICER';
    
    if (!hasAccess) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [role, router, mounted]);

  if (!isAuthorized) {
    return null;
  }

  const highRiskSchools = allSchools.filter(s => s.riskScore > 70).slice(0, 10);

  const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#22c55e'];
  const chartColors = ['#3b82f6', '#0ea5e9', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          {district.name} - Education Equity Dashboard
        </h1>
        <p className="text-slate-600 mt-2">
          Strategic overview of government school performance and equity metrics
        </p>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <RiskCard
          title="Overall Risk Score"
          value={district.metrics.overallRiskScore}
          icon="⚠️"
          riskLevel={
            district.metrics.overallRiskScore > 70
              ? 'high'
              : district.metrics.overallRiskScore > 50
              ? 'medium'
              : 'low'
          }
          trend={5}
        />
        <RiskCard
          title="Girl Protection Index"
          value={district.metrics.girlProtectionIndex}
          icon="👧"
          riskLevel={
            district.metrics.girlProtectionIndex < 50
              ? 'high'
              : district.metrics.girlProtectionIndex < 70
              ? 'medium'
              : 'low'
          }
          trend={8}
        />
        <RiskCard
          title="Structural Vulnerability"
          value={district.metrics.structuralVulnerability}
          icon="🏢"
          riskLevel={
            district.metrics.structuralVulnerability > 70
              ? 'high'
              : district.metrics.structuralVulnerability > 50
              ? 'medium'
              : 'low'
          }
          trend={-3}
        />
        <RiskCard
          title="Teacher Shortage"
          value={district.metrics.teacherShortage}
          icon="👨‍🏫"
          riskLevel={
            district.metrics.teacherShortage > 70
              ? 'high'
              : district.metrics.teacherShortage > 50
              ? 'medium'
              : 'low'
          }
          trend={2}
        />
        <RiskCard
          title="Infrastructure Risk"
          value={district.metrics.infrastructureRisk}
          icon="🏗️"
          riskLevel={
            district.metrics.infrastructureRisk > 70
              ? 'high'
              : district.metrics.infrastructureRisk > 50
              ? 'medium'
              : 'low'
          }
          trend={-2}
        />
      </div>

      {/* Block Comparison Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeatmapGrid data={blockComparison} title="Block Risk Comparison & Performance" />
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Schools</p>
              <p className="text-2xl font-bold text-slate-900">
                {district.metrics.totalSchools}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Schools with Girls Toilet</p>
              <p className="text-2xl font-bold text-green-600">
                {district.metrics.schoolsWithGirlsToilet}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round(
                  (district.metrics.schoolsWithGirlsToilet /
                    district.metrics.totalSchools) *
                    100
                )}
                % coverage
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Avg Teacher-Student Ratio</p>
              <p className="text-2xl font-bold text-blue-600">
                1:{district.metrics.avgTeacherStudentRatio}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Girl Enrollment Rate</p>
              <p className="text-2xl font-bold text-pink-600">
                {district.metrics.girlEnrollmentRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Optimization Panel */}
      <ChartSection
        title="Teacher Distribution & Optimization"
        description="Current teacher allocation vs required positions by block"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teacherData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="block" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="assigned" fill="#3b82f6" name="Teachers Assigned" />
            <Bar dataKey="required" fill="#f59e0b" name="Teachers Required" />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Scholarship & DBT Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection
          title="Direct Benefit Transfer (DBT) Adoption"
          description="Status of digital payment system implementation"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dbtData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dbtData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartSection>

        <ChartSection
          title="Scholarship Coverage Trends"
          description="Girls scholarship enrollment over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                name="Enrolled Girls"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                name="Target"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartSection>
      </div>

      {/* Equity & Bias Monitoring */}
      <ChartSection
        title="Equity & Bias Monitoring - Urban vs Rural"
        description="Comparative analysis of key metrics across urban and rural schools"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={equityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="urban" fill="#3b82f6" name="Urban Schools" />
            <Bar dataKey="rural" fill="#f59e0b" name="Rural Schools" />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* High-Risk Schools Table */}
      <div>
        <SchoolRiskTable
          schools={highRiskSchools}
          title="Critical Risk Schools - Requiring Immediate Intervention"
        />
      </div>
    </div>
  );
}
