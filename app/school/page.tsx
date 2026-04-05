'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/providers/RoleProvider';
import { canAccessSchool } from '@/lib/auth';
import { Student, Teacher, AttendanceRecord } from '@/lib/types';
import { getSchoolData } from '@/lib/schoolMockData';
import { StudentEnrollmentForm } from '@/components/school/StudentEnrollmentForm';
import { StudentTable } from '@/components/school/StudentTable';
import { TeacherEnrollmentForm } from '@/components/school/TeacherEnrollmentForm';
import { TeacherTable } from '@/components/school/TeacherTable';
import { AttendanceChart } from '@/components/school/AttendanceChart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type TabType = 'overview' | 'students' | 'teachers' | 'attendance' | 'infrastructure' | 'risk';

export default function SchoolDashboard() {
  const { role, mounted } = useRole();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Initialize school data from mock data
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const schoolId = 'SCHOOL-001';

  useEffect(() => {
    // Load mock data on component mount
    const schoolData = getSchoolData(schoolId);
    setStudents(schoolData.students);
    setTeachers(schoolData.teachers);
    setAttendance(schoolData.attendance);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    
    const storedRole = sessionStorage.getItem('userRole');
    const hasAccess = canAccessSchool(role) || storedRole === 'SCHOOL';
    
    if (!hasAccess) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [role, router, mounted]);

  if (!isAuthorized) {
    return null;
  }

  const avgAttendance = attendance.length > 0 
    ? Math.round(attendance.reduce((sum, a) => sum + ((a.totalPresent / (a.totalPresent + a.totalAbsent)) * 100), 0) / attendance.length)
    : 0;

  const avgStudentAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length)
    : 0;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            School Management Dashboard
          </h1>
          <p className="text-foreground/70">
            Manage students, teachers, attendance, and infrastructure
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Students</p>
            <p className="text-3xl font-bold text-accent">{students.length}</p>
          </Card>

          <Card className="bg-card border-border p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Teachers</p>
            <p className="text-3xl font-bold text-primary">{teachers.length}</p>
          </Card>

          <Card className="bg-card border-border p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-muted-foreground text-sm font-medium mb-1">Avg Attendance</p>
            <p className="text-3xl font-bold text-success">{avgStudentAttendance}%</p>
          </Card>

          <Card className="bg-card border-border p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-muted-foreground text-sm font-medium mb-1">School ID</p>
            <p className="text-lg font-bold text-primary">{schoolId}</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-border">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'students', label: 'Students' },
              { id: 'teachers', label: 'Teachers' },
              { id: 'attendance', label: 'Attendance' },
              { id: 'infrastructure', label: 'Infrastructure' },
              { id: 'risk', label: 'Risk Score' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 font-bold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-foreground text-lg font-semibold mb-4">School Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
                  <div>
                    <p className="text-sm text-muted-foreground">School Name</p>
                    <p className="text-foreground font-semibold">Government Primary School</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="text-foreground font-semibold">Delhi</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Block</p>
                    <p className="text-foreground font-semibold">Central</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Principal</p>
                    <p className="text-foreground font-semibold">Dr. Suresh Kumar Singh</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Add New Student</h3>
                <StudentEnrollmentForm schoolId={schoolId} onAdd={setStudents} totalStudents={students.length} />
              </Card>
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Student List ({students.length})</h3>
                <StudentTable students={students} />
              </Card>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Add New Teacher</h3>
                <TeacherEnrollmentForm schoolId={schoolId} onAdd={setTeachers} totalTeachers={teachers.length} />
              </Card>
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Teacher List ({teachers.length})</h3>
                <TeacherTable teachers={teachers} />
              </Card>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
                <AttendanceChart records={attendance} />
              </Card>
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
                <h3 className="text-white text-lg font-semibold mb-4">Attendance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <p className="text-sm text-gray-400">Total Records</p>
                    <p className="text-2xl font-bold text-pink-400">{attendance.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Average Attendance</p>
                    <p className="text-2xl font-bold text-green-400">{avgAttendance}%</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Infrastructure Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Building Condition: Good</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Girls Toilet Available: Yes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Drinking Water: Yes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Electricity: Yes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Library: Yes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Laboratory: Yes</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700">
                <p className="text-sm text-gray-400 mb-2">Infrastructure Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-green-400"></div>
                  </div>
                  <span className="text-white font-semibold">82/100</span>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'risk' && (
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
              <h3 className="text-white text-lg font-semibold mb-4">School Risk Assessment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Overall Risk Score</span>
                    <span className="text-green-400 font-semibold">25/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-green-500"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Low Risk</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Infrastructure Risk</span>
                    <span className="text-green-400 font-semibold">18/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/5 bg-green-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Enrollment Risk</span>
                    <span className="text-yellow-400 font-semibold">35/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-yellow-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Teacher Shortage Risk</span>
                    <span className="text-green-400 font-semibold">20/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/5 bg-green-500"></div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
