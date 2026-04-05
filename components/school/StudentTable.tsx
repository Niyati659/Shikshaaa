'use client';

import React, { useState } from 'react';
import { Student } from '@/lib/types';

interface StudentTableProps {
  students: Student[];
  onDelete?: (studentId: string) => void;
}

export function StudentTable({ students, onDelete }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'className' | 'attendance'>('name');

  const filteredStudents = students
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.enrollmentId.includes(searchTerm))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'className') return a.className.localeCompare(b.className);
      if (sortBy === 'attendance') return b.attendancePercentage - a.attendancePercentage;
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
        >
          <option value="name">Sort by Name</option>
          <option value="className">Sort by Class</option>
          <option value="attendance">Sort by Attendance</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-900 to-pink-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Class</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Gender</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Attendance</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Scholarship</th>
              {onDelete && <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="bg-slate-900 hover:bg-slate-800 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-300">{student.enrollmentId}</td>
                <td className="px-4 py-3 text-sm text-white font-medium">{student.name}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{student.className}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{student.gender}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-slate-700 rounded h-2">
                      <div
                        className={`h-full rounded transition-all ${
                          student.attendancePercentage >= 75 ? 'bg-green-500' :
                          student.attendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${student.attendancePercentage}%` }}
                      />
                    </div>
                    <span className="text-gray-300">{student.attendancePercentage}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    student.scholarshipStatus === 'Active' ? 'bg-green-900/30 text-green-300' :
                    student.scholarshipStatus === 'Pending' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-slate-700 text-gray-300'
                  }`}>
                    {student.scholarshipStatus}
                  </span>
                </td>
                {onDelete && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onDelete(student.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-400">
        Showing {filteredStudents.length} of {students.length} students
      </div>
    </div>
  );
}
