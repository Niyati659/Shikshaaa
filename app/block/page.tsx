'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/components/providers/RoleProvider';
import { canAccessBlock } from '@/lib/auth';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { getMockDistrict } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

export default function BlockOverview() {
  const { role, mounted } = useRole();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

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

  if (!isAuthorized) {
    return null;
  }

  const district = getMockDistrict();

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Block Management
        </h1>
        <p className="text-slate-600 mt-2">
          Select a block to view detailed performance and school information
        </p>
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {district.blocks.map((block) => {
          const riskLevel =
            block.averageRiskScore > 70
              ? 'high'
              : block.averageRiskScore > 50
              ? 'medium'
              : 'low';

          return (
            <Link key={block.id} href={`/block/${block.id}`}>
              <div className="group cursor-pointer h-full">
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 h-full transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-200">
                  {/* Block Name */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {block.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {block.schools.length} schools
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">
                        Average Risk Score
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              riskLevel === 'high'
                                ? 'bg-red-500'
                                : riskLevel === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${block.averageRiskScore}%`,
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 w-12 text-right">
                          {block.averageRiskScore}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600 mb-1">Schools at Risk</p>
                        <p className="text-lg font-bold text-red-600">
                          {block.prioritySchools}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600 mb-1">Population</p>
                        <p className="text-lg font-bold text-slate-900">
                          {Math.round(block.population / 1000)}K
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">District Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Blocks</p>
            <p className="text-2xl font-bold text-slate-900">{district.blocks.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Schools</p>
            <p className="text-2xl font-bold text-slate-900">
              {district.blocks.reduce((sum, b) => sum + b.schools.length, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Highest Risk Block</p>
            <p className="text-2xl font-bold text-red-600">
              {Math.max(...district.blocks.map(b => b.averageRiskScore))}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">District Average Risk</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(
                district.blocks.reduce((sum, b) => sum + b.averageRiskScore, 0) /
                  district.blocks.length
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
