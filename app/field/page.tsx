'use client';

import React, { useState, useMemo } from 'react';
import { useRole } from '@/components/providers/RoleProvider';
import { canAccessField } from '@/lib/auth';
import { FieldTaskCard, FieldTask } from '@/components/dashboard/FieldTaskCard';
import { getMockDistrict, getRecommendationsForSchool } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function FieldInterface() {
  const { role, mounted } = useRole();
  const router = useRouter();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  // Get data and call all hooks BEFORE conditional returns
  const district = getMockDistrict();

  // Generate tasks from recommendations
  const allTasks = useMemo(() => {
    const tasks: FieldTask[] = [];
    let taskId = 0;

    // Get high-risk schools from all blocks
    const highRiskSchools = district.blocks
      .flatMap(b => b.schools)
      .filter(s => s.riskScore > 65)
      .slice(0, 15);

    highRiskSchools.forEach(school => {
      const recommendations = getRecommendationsForSchool(school.id, school);

      // Create inspection task
      tasks.push({
        id: `task-${taskId++}`,
        title: `School Inspection - ${school.name}`,
        school: school.name,
        priority: school.riskScore > 80 ? 'HIGH' : 'MEDIUM',
        type: 'inspection',
        dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        description: 'Conduct comprehensive infrastructure and safety assessment',
      });

      // Create intervention tasks from recommendations
      recommendations.forEach(rec => {
        tasks.push({
          id: `task-${taskId++}`,
          title: `${rec.category} - ${rec.action}`,
          school: school.name,
          priority: rec.priority,
          type: 'intervention',
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          description: rec.reasoning,
        });
      });

      // Create follow-up task
      if (school.lastInspection) {
        tasks.push({
          id: `task-${taskId++}`,
          title: `Follow-up Visit - ${school.name}`,
          school: school.name,
          priority: 'MEDIUM',
          type: 'followup',
          dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          description: 'Review progress on previous interventions',
        });
      }
    });

    // Sort by priority and date
    return tasks.sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];

      if (aPriority !== bPriority) return aPriority - bPriority;
      return (a.dueDate || '') < (b.dueDate || '') ? -1 : 1;
    });
  }, [district]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      if (filterPriority === 'ALL') return true;
      return task.priority === filterPriority;
    });
  }, [allTasks, filterPriority]);

  React.useEffect(() => {
    if (!mounted) return;
    
    const storedRole = sessionStorage.getItem('userRole');
    const hasAccess = canAccessField(role) || storedRole === 'FIELD_OFFICER';
    
    if (!hasAccess) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [role, router, mounted]);

  if (!isAuthorized) {
    return null;
  }

  const activeTasks = filteredTasks.filter(t => !completedTasks.has(t.id));
  const completedTaskList = filteredTasks.filter(t => completedTasks.has(t.id));

  const handleCompleteTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    newCompleted.add(taskId);
    setCompletedTasks(newCompleted);
  };

  const handleStartTask = (taskId: string) => {
    // In a real app, this would navigate to a detailed task form
    console.log('Starting task:', taskId);
  };

  const stats = {
    total: filteredTasks.length,
    completed: completedTaskList.length,
    active: activeTasks.length,
    highPriority: filteredTasks.filter(t => t.priority === 'HIGH').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Field Operations</h1>
        <p className="text-slate-600 mt-2">Mobile-optimized task management for school inspections and interventions</p>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-600 mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-600 mb-1">Active</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-600 mb-1">High Priority</p>
          <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-2">
        {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(priority => (
          <button
            key={priority}
            onClick={() => setFilterPriority(priority)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filterPriority === priority
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {priority === 'ALL' ? 'All Tasks' : `${priority} Priority`}
          </button>
        ))}
      </div>

      {/* Active Tasks Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Active Tasks
            {stats.active > 0 && <span className="text-sm font-normal text-slate-600 ml-2">({stats.active})</span>}
          </h2>
        </div>
        
        {activeTasks.length > 0 ? (
          <div className="space-y-3">
            {activeTasks.map(task => (
              <FieldTaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onStart={handleStartTask}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600">No active tasks matching the filter</p>
          </div>
        )}
      </div>

      {/* Completed Tasks Section */}
      {completedTaskList.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Completed Tasks
              <span className="text-sm font-normal text-slate-600 ml-2">({stats.completed})</span>
            </h2>
          </div>

          <div className="space-y-3">
            {completedTaskList.map(task => (
              <FieldTaskCard
                key={task.id}
                task={{ ...task, completed: true }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {allTasks.length === 0 && (
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-slate-600 text-lg">No tasks available at this time</p>
          <p className="text-slate-500 mt-2">Check back later for field inspection assignments</p>
        </div>
      )}
    </div>
  );
}
