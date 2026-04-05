import { District, Block, School, DistrictMetrics, BlockComparisonData, TrendPoint, Recommendation } from './types';

// School name prefixes and suffixes
const schoolPrefixes = ['Government', 'Public', 'Primary', 'Secondary'];
const schoolSuffixes = ['School', 'Academy', 'Center', 'Institute'];
const blockNames = ['North Block', 'South Block', 'East Block', 'West Block', 'Central Block', 'Rural Block'];

function generateSchools(blockId: string, districtId: string, count: number): School[] {
  const schools: School[] = [];
  
  for (let i = 1; i <= count; i++) {
    const schoolId = `${blockId}-school-${i}`;
    const isRural = Math.random() > 0.4;
    const type: 'Primary' | 'Secondary' | 'Combined' = Math.random() > 0.7 ? 'Secondary' : 'Primary';
    
    const totalStudents = Math.floor(Math.random() * 400) + 150;
    const girls = Math.floor(totalStudents * (0.45 + Math.random() * 0.1));
    const boys = totalStudents - girls;
    
    const teachers = Math.max(5, Math.floor(totalStudents / 40));
    const femaleTeachers = Math.floor(teachers * (0.3 + Math.random() * 0.3));
    
    const infrastructureScore = Math.floor(Math.random() * 60) + 30;
    const safetyScore = Math.floor(Math.random() * 50) + 40;
    
    // Calculate dropout rate based on risk factors
    const baseDropout = Math.random() * 15;
    const ruralDropoutPenalty = isRural ? 8 : 0;
    const infrastructureDropoutPenalty = infrastructureScore < 50 ? 5 : 0;
    const teacherDropoutPenalty = teachers < 8 ? 4 : 0;
    const dropoutRate = Math.min(35, Math.floor(baseDropout + ruralDropoutPenalty + infrastructureDropoutPenalty + teacherDropoutPenalty));
    
    const riskFactors: number[] = [];
    if (infrastructureScore < 50) riskFactors.push(20);
    if (safetyScore < 60) riskFactors.push(15);
    if (!isRural && girls < boys * 0.4) riskFactors.push(25);
    if (teachers < 8) riskFactors.push(20);
    if (dropoutRate > 20) riskFactors.push(30);
    
    const baseRisk = (100 - infrastructureScore) * 0.3 + (100 - safetyScore) * 0.2 + (isRural ? 15 : 0) + (dropoutRate > 20 ? 15 : 0);
    const riskScore = Math.min(100, Math.floor(baseRisk + Math.random() * 20));
    
    const interventions: string[] = [];
    if (infrastructureScore < 50) interventions.push('Building repair required');
    if (!isRural && girls < boys * 0.4) interventions.push('Girls enrollment drive');
    if (teachers < 8) interventions.push('Teacher recruitment');
    if (safetyScore < 60) interventions.push('Safety protocol training');
    
    const recommendations: string[] = [];
    if (riskScore > 70) {
      recommendations.push(`Priority intervention: Structural assessment needed at ${schoolId}`);
      recommendations.push(`Implement girls-focused enrollment campaign`);
      recommendations.push(`Teacher capacity building program`);
    } else if (riskScore > 50) {
      recommendations.push(`Monitor infrastructure conditions quarterly`);
      recommendations.push(`Support teacher professional development`);
    }
    
    schools.push({
      id: schoolId,
      name: `${schoolPrefixes[Math.floor(Math.random() * schoolPrefixes.length)]} ${type === 'Primary' ? 'Primary' : 'Secondary'} School ${i}`,
      blockId,
      districtId,
      class: type === 'Primary' ? 'I-V' : 'VI-VIII',
      type,
      girls,
      boys,
      totalStudents,
      girls_sanitation: Math.random() > 0.5,
      girls_classroom: Math.random() > 0.6,
      anganwadi: Math.random() > 0.7,
      mdm: Math.random() > 0.2,
      teachers,
      femaleTeachers,
      infrastructure_score: infrastructureScore,
      safety_score: safetyScore,
      scholarship_girls: Math.floor(girls * (0.2 + Math.random() * 0.4)),
      dbt_coverage: Math.floor(Math.random() * 60) + 20,
      rural: isRural,
      dropoutRate,
      riskScore,
      interventionNeeded: interventions,
      aiRecommendations: recommendations,
      lastInspection: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  }
  
  return schools;
}

function generateBlocks(districtId: string, count: number): Block[] {
  const blocks: Block[] = [];
  
  for (let i = 0; i < count; i++) {
    const blockId = `block-${i + 1}`;
    const schoolsInBlock = Math.floor(Math.random() * 8) + 8;
    const schools = generateSchools(blockId, districtId, schoolsInBlock);
    
    const averageRiskScore = Math.floor(
      schools.reduce((sum, s) => sum + s.riskScore, 0) / schools.length
    );
    
    const prioritySchools = schools.filter(s => s.riskScore > 70).length;
    
    blocks.push({
      id: blockId,
      name: blockNames[i] || `Block ${i + 1}`,
      districtId,
      schools,
      population: Math.floor(Math.random() * 100000) + 50000,
      averageRiskScore,
      prioritySchools,
    });
  }
  
  return blocks;
}

function calculateDistrictMetrics(blocks: Block[]): DistrictMetrics {
  const allSchools = blocks.flatMap(b => b.schools);
  const totalStudents = allSchools.reduce((sum, s) => sum + s.totalStudents, 0);
  const totalGirls = allSchools.reduce((sum, s) => sum + s.girls, 0);
  const totalTeachers = allSchools.reduce((sum, s) => sum + s.teachers, 0);
  const schoolsWithGirlsToilet = allSchools.filter(s => s.girls_sanitation).length;
  const avgInfra = Math.floor(allSchools.reduce((sum, s) => sum + s.infrastructure_score, 0) / allSchools.length);
  const avgSafety = Math.floor(allSchools.reduce((sum, s) => sum + s.safety_score, 0) / allSchools.length);
  
  return {
    overallRiskScore: Math.floor(allSchools.reduce((sum, s) => sum + s.riskScore, 0) / allSchools.length),
    girlProtectionIndex: Math.min(100, Math.floor((totalGirls / totalStudents) * 150)),
    structuralVulnerability: 100 - avgInfra,
    teacherShortage: Math.max(0, Math.floor((1 - totalTeachers / (totalStudents / 35)) * 100)),
    infrastructureRisk: 100 - avgInfra,
    scholarshipCoverage: Math.floor(Math.random() * 40) + 25,
    dbtAdoptionRate: Math.floor(Math.random() * 50) + 30,
    girlEnrollmentRate: Math.floor((totalGirls / totalStudents) * 100),
    schoolsWithGirlsToilet,
    totalSchools: allSchools.length,
    avgTeacherStudentRatio: Math.floor(totalStudents / totalTeachers),
  };
}

export function generateMockDistrict(): District {
  const districtId = 'district-1';
  const blocks = generateBlocks(districtId, 6);
  const metrics = calculateDistrictMetrics(blocks);
  
  return {
    id: districtId,
    name: 'Equity District',
    blocks,
    state: 'Maharashtra',
    population: blocks.reduce((sum, b) => sum + b.population, 0),
    metrics,
  };
}

export function getBlockComparisonData(district: District): BlockComparisonData[] {
  return district.blocks.map(block => ({
    blockId: block.id,
    blockName: block.name,
    riskScore: block.averageRiskScore,
    schoolsAtRisk: block.prioritySchools,
    totalSchools: block.schools.length,
    averageScore: block.averageRiskScore,
  }));
}

export function getTrendData(): TrendPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, i) => ({
    month,
    value: Math.floor(Math.random() * 30) + 50,
    target: 85,
  }));
}

export function getTeacherDistributionData() {
  return [
    { block: 'North', assigned: 145, required: 160, surplus: -15 },
    { block: 'South', assigned: 128, required: 140, surplus: -12 },
    { block: 'East', assigned: 156, required: 150, surplus: 6 },
    { block: 'West', assigned: 132, required: 145, surplus: -13 },
    { block: 'Central', assigned: 168, required: 160, surplus: 8 },
    { block: 'Rural', assigned: 98, required: 110, surplus: -12 },
  ];
}

export function getDBTData() {
  return [
    { name: 'Actively Using', value: 35 },
    { name: 'Partially Adopted', value: 28 },
    { name: 'Piloting', value: 18 },
    { name: 'Not Adopted', value: 19 },
  ];
}

export function getEquityComparisonData() {
  return [
    { category: 'Girls Enrollment', urban: 52, rural: 42 },
    { category: 'Girls Retention', urban: 48, rural: 35 },
    { category: 'Infrastructure', urban: 72, rural: 45 },
    { category: 'Safety Score', urban: 68, rural: 52 },
  ];
}

export function getRecommendationsForSchool(schoolId: string, school: School): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (school.infrastructure_score < 50) {
    recommendations.push({
      id: `${schoolId}-rec-1`,
      schoolId,
      priority: 'HIGH',
      category: 'Infrastructure',
      action: 'Conduct structural assessment and repair budget',
      reasoning: 'School building shows signs of deterioration affecting student safety',
      estimatedImpact: 'Improve safety score by 20-25 points',
    });
  }
  
  if (school.girls < school.boys * 0.45) {
    recommendations.push({
      id: `${schoolId}-rec-2`,
      schoolId,
      priority: 'HIGH',
      category: 'Gender-Safety',
      action: 'Launch targeted girls enrollment campaign',
      reasoning: 'Girl enrollment significantly below state average',
      estimatedImpact: 'Increase girls enrollment by 30-40%',
    });
  }
  
  if (!school.girls_sanitation) {
    recommendations.push({
      id: `${schoolId}-rec-3`,
      schoolId,
      priority: 'HIGH',
      category: 'Gender-Safety',
      action: 'Build separate girls toilets with water supply',
      reasoning: 'Lack of sanitation facilities impacts girls attendance',
      estimatedImpact: 'Reduce girls dropout rate by 15-20%',
    });
  }
  
  if (school.teachers < 8) {
    recommendations.push({
      id: `${schoolId}-rec-4`,
      schoolId,
      priority: 'MEDIUM',
      category: 'Teacher',
      action: 'Recruit and deploy additional teachers',
      reasoning: 'Teacher-student ratio exceeds recommended threshold',
      estimatedImpact: 'Improve learning outcomes by 10-15%',
    });
  }
  
  if (school.dbt_coverage < 40) {
    recommendations.push({
      id: `${schoolId}-rec-5`,
      schoolId,
      priority: 'MEDIUM',
      category: 'Nutrition',
      action: 'Implement direct benefit transfer (DBT) enrollment',
      reasoning: 'Low adoption of digital payment system for meal scheme',
      estimatedImpact: 'Increase MDM transparency by 25%',
    });
  }
  
  return recommendations.slice(0, 3);
}

// Singleton instance
let cachedDistrict: District | null = null;

export function getMockDistrict(): District {
  if (!cachedDistrict) {
    cachedDistrict = generateMockDistrict();
  }
  return cachedDistrict;
}

export function getBlockById(blockId: string): Block | undefined {
  const district = getMockDistrict();
  return district.blocks.find(b => b.id === blockId);
}

export function getSchoolById(schoolId: string): School | undefined {
  const district = getMockDistrict();
  for (const block of district.blocks) {
    const school = block.schools.find(s => s.id === schoolId);
    if (school) return school;
  }
  return undefined;
}
