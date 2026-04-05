'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SchoolDetails {
  schoolName: string;
  principalName: string;
  principalPhone: string;
  schoolEmail: string;
  totalStudents: number;
  girlStudents: number;
  boyStudents: number;
  totalTeachers: number;
  femaleTeachers: number;
  todayAttendance: number;
  girlsAttendancePercentage: number;
  boysAttendancePercentage: number;
  infrastructureNotes: string;
  safetyIssues: string;
}

const initialDetails: SchoolDetails = {
  schoolName: '',
  principalName: '',
  principalPhone: '',
  schoolEmail: '',
  totalStudents: 0,
  girlStudents: 0,
  boyStudents: 0,
  totalTeachers: 0,
  femaleTeachers: 0,
  todayAttendance: 0,
  girlsAttendancePercentage: 0,
  boysAttendancePercentage: 0,
  infrastructureNotes: '',
  safetyIssues: '',
};

export function SchoolDetailsForm() {
  const [details, setDetails] = useState<SchoolDetails>(initialDetails);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: name.includes('Percentage') || name.includes('total') || name.includes('Students') || name.includes('Teachers') || name.includes('Attendance')
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('School details submitted:', details);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">School Details</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Update your school information and attendance records</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* School Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">School Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={details.schoolName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter school name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Principal Name
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={details.principalName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Principal's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Principal Phone
                </label>
                <input
                  type="tel"
                  name="principalPhone"
                  value={details.principalPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  School Email
                </label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={details.schoolEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="school@email.com"
                />
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Student Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total Students
                </label>
                <input
                  type="number"
                  name="totalStudents"
                  value={details.totalStudents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Girl Students
                </label>
                <input
                  type="number"
                  name="girlStudents"
                  value={details.girlStudents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Boy Students
                </label>
                <input
                  type="number"
                  name="boyStudents"
                  value={details.boyStudents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Teacher Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Teacher Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total Teachers
                </label>
                <input
                  type="number"
                  name="totalTeachers"
                  value={details.totalTeachers}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Female Teachers
                </label>
                <input
                  type="number"
                  name="femaleTeachers"
                  value={details.femaleTeachers}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Attendance Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Today's Attendance</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Present Today
                </label>
                <input
                  type="number"
                  name="todayAttendance"
                  value={details.todayAttendance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Girls Attendance %
                </label>
                <input
                  type="number"
                  name="girlsAttendancePercentage"
                  value={details.girlsAttendancePercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Boys Attendance %
                </label>
                <input
                  type="number"
                  name="boysAttendancePercentage"
                  value={details.boysAttendancePercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0-100"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Infrastructure Notes
              </label>
              <textarea
                name="infrastructureNotes"
                value={details.infrastructureNotes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Describe any infrastructure improvements or issues..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Safety Issues (if any)
              </label>
              <textarea
                name="safetyIssues"
                value={details.safetyIssues}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Report any safety concerns or observations..."
              />
            </div>
          </div>

          {/* Submit Button and Confirmation */}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Submit Details
            </Button>

            {submitted && (
              <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300">
                Details submitted successfully!
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
