'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getMockDistrict } from '@/lib/mockData';
import { NGOUser, NGOSchoolAssignment } from '@/lib/types';
import { useRole } from '@/components/providers/RoleProvider';

export default function NGODashboard() {
  const router = useRouter();
  const { setRole } = useRole();
  const [currentNGO, setCurrentNGO] = React.useState<NGOUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDropout, setFilterDropout] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [assignments, setAssignments] = useState<NGOSchoolAssignment[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  React.useEffect(() => {
    const ngo = sessionStorage.getItem('currentNGO');
    if (!ngo) {
      router.push('/ngo/auth');
      return;
    }
    setCurrentNGO(JSON.parse(ngo));
    
    const stored = sessionStorage.getItem('ngoAssignments');
    if (stored) {
      setAssignments(JSON.parse(stored));
    }
  }, [router]);

  const district = getMockDistrict();
  const allSchools = useMemo(
    () => district.blocks.flatMap(b => b.schools),
    [district]
  );

  const myAssignments = useMemo(
    () => assignments.filter(a => a.ngoId === currentNGO?.id),
    [assignments, currentNGO]
  );

  const filteredSchools = useMemo(() => {
    let filtered = allSchools.filter(school => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDropout =
        filterDropout === 'all' ||
        (filterDropout === 'high' && school.dropoutRate > 20) ||
        (filterDropout === 'medium' && school.dropoutRate > 10 && school.dropoutRate <= 20) ||
        (filterDropout === 'low' && school.dropoutRate <= 10);

      return matchesSearch && matchesDropout;
    });

    return filtered;
  }, [allSchools, searchTerm, filterDropout]);

  const focusAreasOptions = ['Girl Education', 'Infrastructure', 'Nutrition', 'Teacher Training', 'Dropout Prevention', 'Digital Literacy'];

  const handleAssignSchool = (schoolId: string) => {
    if (!currentNGO) return;

    const alreadyAssigned = assignments.some(
      a => a.ngoId === currentNGO.id && a.schoolId === schoolId && a.status === 'Active'
    );

    if (alreadyAssigned) {
      alert('You are already assigned to this school');
      return;
    }

    if (focusAreas.length === 0) {
      alert('Please select at least one focus area');
      return;
    }

    const newAssignment: NGOSchoolAssignment = {
      id: `ASS-${Date.now()}`,
      ngoId: currentNGO.id,
      schoolId,
      assignedDate: new Date().toISOString(),
      status: 'Active',
      focusAreas,
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    sessionStorage.setItem('ngoAssignments', JSON.stringify(updatedAssignments));

    setSelectedSchoolId(null);
    setFocusAreas([]);
    alert('Successfully assigned to school!');
  };

  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentNGO');
    sessionStorage.removeItem('ngoAssignments');
    sessionStorage.removeItem('ngoActivities');
    setRole(null);
  };

  if (!currentNGO) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">{currentNGO.organizationName}</h1>
            <p className="text-foreground/70">Welcome back, {currentNGO.contactPerson}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Discover Schools in Need</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search schools by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-2 flex-wrap">
                {(['all', 'high', 'medium', 'low'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setFilterDropout(filter)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      filterDropout === filter
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'high' ? 'High Dropout (>20%)' : filter === 'medium' ? 'Medium (10-20%)' : 'Low (<10%)'}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Available Schools ({filteredSchools.length})</h3>
            {filteredSchools.map(school => (
              <Card
                key={school.id}
                className="bg-card border-border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedSchoolId(selectedSchoolId === school.id ? null : school.id);
                  setFocusAreas([]);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-foreground mb-2">{school.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-foreground/70">Dropout Rate</p>
                        <p className="font-semibold text-accent">{school.dropoutRate}%</p>
                      </div>
                      <div>
                        <p className="text-foreground/70">Risk Score</p>
                        <p className={`font-semibold ${school.riskScore > 70 ? 'text-destructive' : school.riskScore > 50 ? 'text-warning' : 'text-success'}`}>
                          {school.riskScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/70">Students</p>
                        <p className="font-semibold text-foreground">{school.totalStudents}</p>
                      </div>
                      <div>
                        <p className="text-foreground/70">Teachers</p>
                        <p className="font-semibold text-foreground">{school.teachers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {myAssignments.some(a => a.schoolId === school.id && a.status === 'Active') && (
                      <div className="bg-success/10 border border-success/50 text-success px-3 py-1 rounded-full text-sm font-semibold">
                        Assigned
                      </div>
                    )}
                  </div>
                </div>

                {selectedSchoolId === school.id && !myAssignments.some(a => a.schoolId === school.id && a.status === 'Active') && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm font-semibold text-foreground mb-3">Select focus areas:</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {focusAreasOptions.map(area => (
                        <button
                          key={area}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFocusArea(area);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            focusAreas.includes(area)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignSchool(school.id);
                      }}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                    >
                      Assign to This School
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="bg-card border-border p-6 sticky top-6">
            <h3 className="text-lg font-bold text-foreground mb-4">My Assignments ({myAssignments.length})</h3>
            {myAssignments.length === 0 ? (
              <p className="text-foreground/70 text-sm">You have not assigned yourself to any schools yet.</p>
            ) : (
              <div className="space-y-3">
                {myAssignments.map(assignment => {
                  const school = allSchools.find(s => s.id === assignment.schoolId);
                  return (
                    <div key={assignment.id} className="p-3 bg-secondary/50 rounded-lg border border-border">
                      <p className="font-semibold text-foreground text-sm mb-2">{school?.name}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-foreground/70">Focus Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {assignment.focusAreas.map(area => (
                            <span key={area} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push(`/ngo/activities?schoolId=${assignment.schoolId}`)}
                        className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold py-1"
                      >
                        Upload Activities
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
