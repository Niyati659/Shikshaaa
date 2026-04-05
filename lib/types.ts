// Role types
export type UserRole = 'BLOCK_OFFICER' | 'SCHOOL' | 'NGO' | null;

// School attendance types
export interface AttendanceRecord {
  date: string; // ISO date string
  totalPresent: number;
  totalAbsent: number;
  boysPresentPercentage: number;
  girlsPresentPercentage: number;
}

// School data types
export interface School {
  id: string;
  name: string;
  blockId: string;
  districtId: string;
  class: string; // Class range: e.g., "I-V", "VI-VIII"
  type: 'Primary' | 'Secondary' | 'Combined';
  girls: number;
  boys: number;
  totalStudents: number;
  girls_sanitation: boolean;
  girls_classroom: boolean;
  anganwadi: boolean;
  mdm: boolean; // Mid-Day Meal
  teachers: number;
  femaleTeachers: number;
  infrastructure_score: number; // 0-100
  dropoutRate: number; // 0-100, percentage of students who dropped out
  safety_score: number; // 0-100
  scholarship_girls: number;
  dbt_coverage: number; // 0-100
  rural: boolean;
  riskScore: number; // 0-100
  interventionNeeded: string[];
  aiRecommendations: string[];
  lastInspection?: string; // ISO date string
  // School-added details
  attendanceRecords?: AttendanceRecord[];
  currentAttendancePercentage?: number; // 0-100
  principalName?: string;
  principalPhone?: string;
  schoolEmail?: string;
}

// Block data types
export interface Block {
  id: string;
  name: string;
  districtId: string;
  schools: School[];
  population: number;
  averageRiskScore: number;
  prioritySchools: number; // Schools with risk score > 70
}

// District data types
export interface District {
  id: string;
  name: string;
  blocks: Block[];
  state: string;
  population: number;
  metrics: DistrictMetrics;
}

export interface DistrictMetrics {
  overallRiskScore: number; // 0-100
  girlProtectionIndex: number; // 0-100
  structuralVulnerability: number; // 0-100
  teacherShortage: number; // 0-100
  infrastructureRisk: number; // 0-100
  scholarshipCoverage: number; // 0-100
  dbtAdoptionRate: number; // 0-100
  girlEnrollmentRate: number; // 0-100
  schoolsWithGirlsToilet: number;
  totalSchools: number;
  avgTeacherStudentRatio: number;
}

// Trend data for charts
export interface TrendPoint {
  month: string;
  value: number;
  target?: number;
}

// Block comparison data
export interface BlockComparisonData {
  blockId: string;
  blockName: string;
  riskScore: number;
  schoolsAtRisk: number;
  totalSchools: number;
  averageScore: number;
}

// AI Recommendation types
export interface Recommendation {
  id: string;
  schoolId: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'Infrastructure' | 'Gender-Safety' | 'Nutrition' | 'Teacher' | 'Enrollment';
  action: string;
  reasoning: string;
  estimatedImpact: string;
  assignedTo?: string;
  status?: 'Open' | 'In Progress' | 'Completed';
}

// Filter types
export interface RiskFilters {
  minRiskScore: number;
  maxRiskScore: number;
  schoolType?: 'Primary' | 'Secondary' | 'Combined' | 'All';
  priorityOnly: boolean;
  categories?: string[];
}

// Student types
export interface Student {
  id: string;
  enrollmentId: string; // Format: STU-001
  schoolId: string;
  name: string;
  className: string; // Class I-XII
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string; // ISO date
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  caste: string;
  religion: string;
  enrollmentDate: string; // ISO date
  previousSchool?: string;
  scholarshipStatus: 'Active' | 'Inactive' | 'Pending';
  attendancePercentage: number; // 0-100
}

// Teacher types
export interface Teacher {
  id: string;
  employeeId: string; // Format: TEA-001
  schoolId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  qualifications: string;
  classesTeaching: string[]; // e.g., ['Class I', 'Class II']
  subjects: string[]; // e.g., ['Math', 'Science']
  dateOfJoining: string; // ISO date
  designations: string;
  phone: string;
  email?: string;
  trainingCompleted: string[]; // Training programs completed
}

// Infrastructure data types
export interface InfrastructureData {
  schoolId: string;
  buildingCondition: 'Good' | 'Fair' | 'Poor';
  classroomsTotal: number;
  classroomsInGoodCondition: number;
  toilets: number;
  girlsToiletAvailable: boolean;
  drinkingWaterAvailable: boolean;
  electricity: boolean;
  library: boolean;
  laboratoryAvailable: boolean;
  playground: boolean;
  boundaryWall: boolean;
  lastMaintenanceDate?: string; // ISO date
  infrastructureScore: number; // 0-100
  safetyScore: number; // 0-100
  notes: string;
}

// School Registration types
export interface SchoolRegistration {
  schoolId: string;
  registrationDate: string; // ISO date
  principalName: string;
  principalPhone: string;
  principalEmail: string;
  schoolEmail: string;
  schoolPhone: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  established: string; // ISO date
  registrationNumber: string;
  recognitionNumber: string;
  boardAffiliation: string;
  registrationStatus: 'Complete' | 'Incomplete' | 'Under Review';
  lastUpdated: string; // ISO date
}

// NGO types
export interface NGOUser {
  id: string;
  email: string;
  organizationName: string;
  contactPerson: string;
  phone: string;
  password: string; // Will be hashed in real app
  registrationDate: string; // ISO date
  profileComplete: boolean;
  description?: string;
  website?: string;
  registrationNumber?: string;
}

export interface NGOSchoolAssignment {
  id: string;
  ngoId: string;
  schoolId: string;
  assignedDate: string; // ISO date
  status: 'Active' | 'Completed' | 'Paused';
  focusAreas: string[]; // e.g., ['Girl Education', 'Infrastructure', 'Nutrition']
  targetOutcome?: string;
}

export interface NGOActivity {
  id: string;
  ngoId: string;
  schoolId: string;
  assignmentId: string;
  activityType: 'Document' | 'Assessment' | 'Report' | 'Photo' | 'Reading';
  title: string;
  description: string;
  date: string; // ISO date
  findings?: string; // Key findings from the activity
  recommendations?: string; // Recommendations based on findings
  fileUrl?: string; // File path or URL
  fileName?: string;
  fileType?: string; // PDF, Image, Video, etc.
  tags: string[];
}

export interface NGODashboardStats {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  totalActivities: number;
  schoolsReached: number;
}
