'use client';

import React, { useState } from 'react';
import { Teacher } from '@/lib/types';

interface TeacherTableProps {
  teachers: Teacher[];
  onDelete?: (teacherId: string) => void;
}

export function TeacherTable({ teachers, onDelete }: TeacherTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.employeeId.includes(searchTerm)
  );

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
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-900 to-pink-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Designation</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Qualifications</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Subjects</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Contact</th>
              {onDelete && <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id} className="bg-slate-900 hover:bg-slate-800 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-300">{teacher.employeeId}</td>
                <td className="px-4 py-3 text-sm text-white font-medium">{teacher.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs font-medium">
                    {teacher.designations}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{teacher.qualifications}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{teacher.subjects.join(', ')}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{teacher.phone}</td>
                {onDelete && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onDelete(teacher.id)}
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
        Showing {filteredTeachers.length} of {teachers.length} teachers
      </div>
    </div>
  );
}
