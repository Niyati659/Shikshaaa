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

type InfraResult = {
  answer: 'Yes' | 'No';
  condition: 'Perfect' | 'Good' | 'Bad';
  imageUrl?: string;   // blob URL for preview
  error?: string;      // fallback error message
};

type InfraState = {
  [key: string]: InfraResult & { loading?: boolean };
};

export default function SchoolDashboard() {
  const { role, mounted } = useRole();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [results, setResults] = useState<InfraState>({});

  // Initialize school data from mock data
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const schoolId = 'SCHOOL-001';

  useEffect(() => {
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

  if (!isAuthorized) return null;

  const avgAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((sum, a) => sum + ((a.totalPresent / (a.totalPresent + a.totalAbsent)) * 100), 0) / attendance.length)
    : 0;

  const avgStudentAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length)
    : 0;

  // ─── Infrastructure score (dynamic) ────────────────────────────────────────
  const infraItems = [
    { label: 'Building',       key: 'building'},
    { label: 'Girls Toilet',   key: 'toilet'},
    { label: 'Drinking Water', key: 'water'},
    { label: 'Electricity',    key: 'electricity'},
    { label: 'Library',        key: 'library'},
    { label: 'Laboratory',     key: 'lab'},
  ];

  const conditionScore = (r: InfraResult) => {
    if (r.answer === 'No') return 0;
    if (r.condition === 'Perfect') return 100;
    if (r.condition === 'Good') return 70;
    return 20; // Bad
  };

  const analyzedKeys = Object.keys(results).filter((k) => !results[k].loading);
  const infraScore = analyzedKeys.length > 0
    ? Math.round(analyzedKeys.reduce((sum, k) => sum + conditionScore(results[k]), 0) / infraItems.length)
    : null; // null = no uploads yet

  // ─── Upload handler ─────────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setResults((prev) => ({
        ...prev,
        [type]: { answer: 'No', condition: 'Bad', error: 'Please upload a valid image file.' },
      }));
      return;
    }

    // Create local blob URL for immediate preview
    const imageUrl = URL.createObjectURL(file);

    // Set loading state with preview
    setResults((prev) => ({
      ...prev,
      [type]: { answer: 'No', condition: 'Bad', imageUrl, loading: true },
    }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      // Validate response shape
      const answer = data.answer === 'Yes' ? 'Yes' : 'No';
      const validConditions = ['Perfect', 'Good', 'Bad'];
      const condition = validConditions.includes(data.condition) ? data.condition : 'Good';

      setResults((prev) => ({
        ...prev,
        [type]: { answer, condition, imageUrl, loading: false },
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setResults((prev) => ({
        ...prev,
        [type]: {
          answer: 'No',
          condition: 'Bad',
          imageUrl,
          loading: false,
          error: errorMessage,
        },
      }));
    }

    // Reset input so the same file can be re-uploaded
    e.target.value = '';
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const dotColor = (key: string) => {
    const r = results[key];
    if (!r || r.loading) return 'bg-slate-500';
    if (r.error) return 'bg-orange-400';
    if (r.answer === 'No') return 'bg-red-500';
    if (r.condition === 'Perfect') return 'bg-emerald-400';
    if (r.condition === 'Good') return 'bg-yellow-400';
    return 'bg-red-500';
  };

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
              { id: 'overview',        label: 'Overview' },
              { id: 'students',        label: 'Students' },
              { id: 'teachers',        label: 'Teachers' },
              { id: 'attendance',      label: 'Attendance' },
              { id: 'infrastructure',  label: 'Infrastructure' },
              { id: 'risk',            label: 'Risk Score' },
            ].map((tab) => (
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
          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-foreground text-lg font-semibold mb-4">School Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
                  <div>
                    <p className="text-sm text-muted-foreground">School Name</p>
                    <p className="font-semibold">Government Primary School</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-semibold">Delhi</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Block</p>
                    <p className="font-semibold">Central</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Principal</p>
                    <p className="font-semibold">Dr. Suresh Kumar Singh</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ── Students ── */}
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

          {/* ── Teachers ── */}
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

          {/* ── Attendance ── */}
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

          {/* ── Infrastructure ── */}
          {activeTab === 'infrastructure' && (
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
              <h3 className="text-white text-lg font-semibold mb-6">Infrastructure Status</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {infraItems.map((item) => {
                  const result = results[item.key];
                  const isLoading = result?.loading;
                  const hasError = result?.error;
                  const hasResult = result && !isLoading;

                  return (
                    <div
                      key={item.key}
                      className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-slate-500"
                    >
                      {/* Top row: status dot + label + upload button */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${dotColor(item.key)} ${
                              isLoading ? 'animate-pulse' : ''
                            }`}
                          />
                          <span className="text-gray-200 text-sm font-medium">
                            {item.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Hidden file input */}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`upload-${item.key}`}
                            onChange={(e) => handleUpload(e, item.key)}
                            disabled={isLoading}
                          />
                          <label
                            htmlFor={`upload-${item.key}`}
                            className={`text-xs px-3 py-1.5 border rounded-lg cursor-pointer transition-colors select-none ${
                              isLoading
                                ? 'border-slate-600 text-slate-500 cursor-not-allowed'
                                : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            {isLoading ? 'Analyzing…' : result?.imageUrl ? 'Re-upload' : 'Upload Proof'}
                          </label>

                          {/* Result badges — only after successful analysis */}
                          {hasResult && !hasError && (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-xs px-2 py-1 rounded-md font-semibold ${
                                  result.answer === 'Yes'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {result.answer}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-md font-medium ${
                                  result.condition === 'Perfect'
                                    ? 'bg-emerald-600/20 text-emerald-300'
                                    : result.condition === 'Good'
                                    ? 'bg-yellow-500/20 text-yellow-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {result.condition}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image preview area */}
                      {result?.imageUrl && (
                        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-600 bg-slate-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={result.imageUrl}
                            alt={`${item.label} proof`}
                            className="w-full h-full object-cover"
                          />

                          {/* Loading overlay */}
                          {isLoading && (
                            <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center gap-2">
                              <svg
                                className="w-7 h-7 text-blue-400 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12" cy="12" r="10"
                                  stroke="currentColor" strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              <span className="text-xs text-blue-300 font-medium">AI analyzing…</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Error fallback banner */}
                      {hasError && (
                        <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2">
                          <span className="text-orange-400 text-sm mt-0.5">⚠</span>
                          <div>
                            <p className="text-orange-300 text-xs font-medium">Analysis failed</p>
                            <p className="text-orange-400/80 text-xs mt-0.5">{result.error}</p>
                            <p className="text-slate-400 text-xs mt-1">
                              Please re-upload the image to retry.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Infrastructure Score */}
              <div className="mt-6 pt-5 border-t border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">
                    Infrastructure Score
                    {analyzedKeys.length > 0 && (
                      <span className="ml-2 text-xs text-slate-500">
                        ({analyzedKeys.length}/{infraItems.length} items assessed)
                      </span>
                    )}
                  </p>
                  <span className="text-white font-semibold text-sm">
                    {infraScore !== null ? `${infraScore}/100` : '—'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    {infraScore !== null ? (
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          infraScore >= 70
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                            : infraScore >= 40
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                            : 'bg-gradient-to-r from-red-600 to-red-400'
                        }`}
                        style={{ width: `${infraScore}%` }}
                      />
                    ) : (
                      <div className="h-full w-0" />
                    )}
                  </div>
                </div>

                {infraScore === null && (
                  <p className="text-xs text-slate-500 mt-2">
                    Upload proof images to calculate the infrastructure score.
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* ── Risk ── */}
          {activeTab === 'risk' && (
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 p-6">
              <h3 className="text-white text-lg font-semibold mb-4">School Risk Assessment</h3>
              <div className="space-y-4">
                {[
                  { label: 'Overall Risk Score',     score: 25, color: 'bg-green-500',  text: 'text-green-400',  note: 'Low Risk' },
                  { label: 'Infrastructure Risk',    score: 18, color: 'bg-green-500',  text: 'text-green-400' },
                  { label: 'Enrollment Risk',        score: 35, color: 'bg-yellow-500', text: 'text-yellow-400' },
                  { label: 'Teacher Shortage Risk',  score: 20, color: 'bg-green-500',  text: 'text-green-400' },
                ].map((risk) => (
                  <div key={risk.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{risk.label}</span>
                      <span className={`${risk.text} font-semibold`}>{risk.score}/100</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${risk.color} rounded-full`}
                        style={{ width: `${risk.score}%` }}
                      />
                    </div>
                    {risk.note && (
                      <p className="text-xs text-gray-400 mt-1">{risk.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}