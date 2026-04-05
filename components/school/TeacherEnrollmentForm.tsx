'use client';

import React, { useState } from 'react';
import { Teacher } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface TeacherEnrollmentFormProps {
  schoolId: string;
  onAdd: (teacher: Teacher) => void;
  totalTeachers: number;
}

export function TeacherEnrollmentForm({ schoolId, onAdd, totalTeachers }: TeacherEnrollmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    qualifications: 'B.Ed',
    designations: 'Teacher',
    phone: '',
    email: '',
    dateOfJoining: '',
  });

  const [classesTeaching, setClassesTeaching] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleClass = (className: string) => {
    setClassesTeaching(prev =>
      prev.includes(className)
        ? prev.filter(c => c !== className)
        : [...prev, className]
    );
  };

  const toggleSubject = (subject: string) => {
    setSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTeacher: Teacher = {
      id: `TEA-${String(totalTeachers + 1).padStart(4, '0')}`,
      employeeId: `TEA-${String(totalTeachers + 1).padStart(3, '0')}`,
      schoolId,
      name: formData.name,
      gender: formData.gender as 'Male' | 'Female' | 'Other',
      qualifications: formData.qualifications,
      classesTeaching,
      subjects,
      dateOfJoining: formData.dateOfJoining,
      designations: formData.designations,
      phone: formData.phone,
      email: formData.email,
      trainingCompleted: ['Digital Literacy'],
    };

    onAdd(newTeacher);
    setFormData({
      name: '',
      gender: 'Male',
      qualifications: 'B.Ed',
      designations: 'Teacher',
      phone: '',
      email: '',
      dateOfJoining: '',
    });
    setClassesTeaching([]);
    setSubjects([]);
  };

  const classes = ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII'];
  const subjectsList = ['Math', 'Science', 'English', 'Hindi', 'Social Studies', 'Physical Education', 'Art', 'Computer Science'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Teacher Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
            placeholder="Enter teacher name"
          />
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Qualifications</label>
          <select
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            {['B.Ed', 'M.Ed', 'B.A B.Ed', 'B.Sc B.Ed', 'B.Com B.Ed'].map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Designation</label>
          <select
            name="designations"
            value={formData.designations}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          >
            <option>Teacher</option>
            <option>Head Master</option>
            <option>Principal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
            placeholder="+91 phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
            placeholder="teacher@school.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date of Joining</label>
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Classes Teaching</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {classes.map(cls => (
            <label key={cls} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={classesTeaching.includes(cls)}
                onChange={() => toggleClass(cls)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-300">{cls}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Subjects</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {subjectsList.map(subject => (
            <label key={subject} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={subjects.includes(subject)}
                onChange={() => toggleSubject(subject)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-300">{subject}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 font-medium"
      >
        Add Teacher
      </Button>
    </form>
  );
}
