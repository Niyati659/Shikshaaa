import { Student, Teacher, SchoolRegistration, InfrastructureData, AttendanceRecord } from './types';

// Generate mock students (200 students)
export function generateMockStudents(schoolId: string): Student[] {
  const students: Student[] = [];
  const classNames = ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII'];
  const firstNamesBoys = ['Arjun', 'Rahul', 'Vikram', 'Aditya', 'Rohan', 'Nikhil', 'Varun', 'Karan'];
  const firstNamesGirls = ['Priya', 'Anjali', 'Sneha', 'Divya', 'Isha', 'Neha', 'Pooja', 'Meera'];
  const surnames = ['Kumar', 'Singh', 'Patel', 'Sharma', 'Gupta', 'Verma', 'Rao', 'Nair'];
  const castes = ['General', 'SC', 'ST', 'OBC'];
  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist'];

  for (let i = 1; i <= 200; i++) {
    const gender = Math.random() > 0.5 ? 'Female' : 'Male';
    const firstName = gender === 'Female' ? firstNamesGirls[Math.floor(Math.random() * firstNamesGirls.length)] : firstNamesBoys[Math.floor(Math.random() * firstNamesBoys.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const className = classNames[Math.floor(Math.random() * classNames.length)];

    students.push({
      id: `STU-${String(i).padStart(4, '0')}`,
      enrollmentId: `STU-${String(i).padStart(3, '0')}`,
      schoolId,
      name: `${firstName} ${surname}`,
      className,
      gender: gender as 'Male' | 'Female',
      dateOfBirth: `${2000 + Math.floor(i / 25)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      fatherName: `Sh. ${surname}`,
      motherName: `Smt. ${['Ramya', 'Kavya', 'Deepa', 'Savita', 'Anita'][Math.floor(Math.random() * 5)]}`,
      guardianPhone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      caste: castes[Math.floor(Math.random() * castes.length)],
      religion: religions[Math.floor(Math.random() * religions.length)],
      enrollmentDate: `2023-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      scholarshipStatus: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)] as 'Active' | 'Inactive' | 'Pending',
      attendancePercentage: Math.floor(Math.random() * 40) + 60, // 60-100%
    });
  }
  return students;
}

// Generate mock teachers (15 teachers)
export function generateMockTeachers(schoolId: string): Teacher[] {
  const teachers: Teacher[] = [];
  const firstNames = ['Ramesh', 'Priya', 'Suresh', 'Anjali', 'Mohan', 'Deepa', 'Rajesh', 'Kavya', 'Vikram', 'Neha', 'Arun', 'Pooja', 'Sanjeev', 'Ritu', 'Ashok'];
  const surnames = ['Kumar', 'Singh', 'Patel', 'Sharma', 'Verma', 'Rao', 'Nair', 'Gupta'];
  const qualifications = ['B.Ed', 'M.Ed', 'B.A B.Ed', 'B.Sc B.Ed', 'B.Com B.Ed'];
  const subjects = ['Math', 'Science', 'English', 'Hindi', 'Social Studies', 'Physical Education', 'Art', 'Computer Science'];

  for (let i = 1; i <= 15; i++) {
    const firstName = firstNames[i - 1];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const gender = ['Male', 'Female'][Math.floor(Math.random() * 2)] as 'Male' | 'Female';

    teachers.push({
      id: `TEA-${String(i).padStart(4, '0')}`,
      employeeId: `TEA-${String(i).padStart(3, '0')}`,
      schoolId,
      name: `${firstName} ${surname}`,
      gender,
      qualifications: qualifications[Math.floor(Math.random() * qualifications.length)],
      classesTeaching: [`Class ${Math.floor(Math.random() * 8) + 1}`, `Class ${Math.floor(Math.random() * 8) + 1}`],
      subjects: [subjects[Math.floor(Math.random() * subjects.length)], subjects[Math.floor(Math.random() * subjects.length)]],
      dateOfJoining: `${2015 + Math.floor(i / 8)}-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      designations: i <= 1 ? 'Principal' : i <= 3 ? 'Head Master' : 'Teacher',
      phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `${firstName.toLowerCase()}.${surname.toLowerCase()}@school.com`,
      trainingCompleted: ['Digital Literacy', 'Gender Sensitivity', 'Child Psychology'],
    });
  }
  return teachers;
}

// Generate mock attendance records (6 months)
export function generateMockAttendanceRecords(studentCount: number): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const startDate = new Date('2024-09-01');

  for (let month = 0; month < 6; month++) {
    for (let day = 1; day <= 20; day++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + month);
      date.setDate(day);

      const presentPercentage = Math.floor(Math.random() * 30) + 70; // 70-100%
      const totalPresent = Math.round((studentCount * presentPercentage) / 100);
      const totalAbsent = studentCount - totalPresent;

      records.push({
        date: date.toISOString().split('T')[0],
        totalPresent,
        totalAbsent,
        boysPresentPercentage: Math.floor(Math.random() * 30) + 70,
        girlsPresentPercentage: Math.floor(Math.random() * 30) + 70,
      });
    }
  }
  return records;
}

// Mock School Registration
export function generateMockSchoolRegistration(schoolId: string): SchoolRegistration {
  return {
    schoolId,
    registrationDate: '2020-06-15',
    principalName: 'Dr. Suresh Kumar Singh',
    principalPhone: '+919876543210',
    principalEmail: 'principal@school.com',
    schoolEmail: 'contact@school.com',
    schoolPhone: '+91-11-2345-6789',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: '123 Education Lane, New Delhi, Delhi 110001',
    },
    established: '1985-03-15',
    registrationNumber: 'REG/2020/DL/001',
    recognitionNumber: 'REC/2020/DL/001',
    boardAffiliation: 'CBSE',
    registrationStatus: 'Complete',
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

// Mock Infrastructure Data
export function generateMockInfrastructureData(schoolId: string): InfrastructureData {
  return {
    schoolId,
    buildingCondition: 'Good',
    classroomsTotal: 32,
    classroomsInGoodCondition: 28,
    toilets: 8,
    girlsToiletAvailable: true,
    drinkingWaterAvailable: true,
    electricity: true,
    library: true,
    laboratoryAvailable: true,
    playground: true,
    boundaryWall: true,
    lastMaintenanceDate: '2024-03-15',
    infrastructureScore: 82,
    safetyScore: 78,
    notes: 'Well-maintained infrastructure with modern facilities. Library upgraded in 2023.',
  };
}

// Main function to get all school data
export function getSchoolData(schoolId: string) {
  return {
    students: generateMockStudents(schoolId),
    teachers: generateMockTeachers(schoolId),
    attendance: generateMockAttendanceRecords(200),
    registration: generateMockSchoolRegistration(schoolId),
    infrastructure: generateMockInfrastructureData(schoolId),
  };
}
