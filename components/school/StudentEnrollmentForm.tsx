'use client';

import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface StudentEnrollmentFormProps {
  schoolId: string;
  onAdd: (student: Student) => void;
  totalStudents: number;
}

export function StudentEnrollmentForm({ schoolId, onAdd, totalStudents }: StudentEnrollmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    className: 'Class I',
    gender: 'Male',
    dateOfBirth: '',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    caste: 'General',
    religion: 'Hindu',
    scholarshipStatus: 'Pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStudent: Student = {
      id: `STU-${String(totalStudents + 1).padStart(4, '0')}`,
      enrollmentId: `STU-${String(totalStudents + 1).padStart(3, '0')}`,
      schoolId,
      name: formData.name,
      className: formData.className,
      gender: formData.gender as 'Male' | 'Female' | 'Other',
      dateOfBirth: formData.dateOfBirth,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      guardianPhone: formData.guardianPhone,
      caste: formData.caste,
      religion: formData.religion,
      enrollmentDate: new Date().toISOString().split('T')[0],
      scholarshipStatus: formData.scholarshipStatus as 'Active' | 'Inactive' | 'Pending',
      attendancePercentage: 85,
    };

    onAdd(newStudent);
    setFormData({
      name: '',
      className: 'Class I',
      gender: 'Male',
      dateOfBirth: '',
      fatherName: '',
      motherName: '',
      guardianPhone: '',
      caste: 'General',
      religion: 'Hindu',
      scholarshipStatus: 'Pending',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Student Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
            placeholder="Enter student name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
          <select
            name="className"
            value={formData.className}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            {['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII'].map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Father Name</label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
            placeholder="Father's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Mother Name</label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
            placeholder="Mother's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Guardian Phone</label>
          <input
            type="tel"
            name="guardianPhone"
            value={formData.guardianPhone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
            placeholder="+91 phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Caste</label>
          <select
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            {['General', 'SC', 'ST', 'OBC'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Religion</label>
          <select
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Scholarship Status</label>
          <select
            name="scholarshipStatus"
            value={formData.scholarshipStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 font-medium"
      >
        Add Student
      </Button>
    </form>
  );
}
