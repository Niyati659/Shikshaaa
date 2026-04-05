'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getMockDistrict } from '@/lib/mockData';
import { NGOUser, NGOActivity, NGOSchoolAssignment } from '@/lib/types';

export default function NGOActivitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');

  const [mounted, setMounted] = React.useState(false);
  const [currentNGO, setCurrentNGO] = React.useState<NGOUser | null>(null);
  const [assignment, setAssignment] = useState<NGOSchoolAssignment | null>(null);
  const [activities, setActivities] = useState<NGOActivity[]>([]);

  const [formData, setFormData] = useState({
    activityType: 'Document' as 'Document' | 'Assessment' | 'Report' | 'Photo' | 'Reading',
    title: '',
    description: '',
    findings: '',
    recommendations: '',
    fileName: '',
    fileType: '',
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  const district = getMockDistrict();
  const allSchools = district.blocks.flatMap(b => b.schools);
  const school = allSchools.find(s => s.id === schoolId);

  React.useEffect(() => {
    setMounted(true);
    const ngo = sessionStorage.getItem('currentNGO');
    if (!ngo) {
      router.push('/ngo/auth');
      return;
    }
    setCurrentNGO(JSON.parse(ngo));
    
    const storedActivities = sessionStorage.getItem('ngoActivities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, [router]);

  useEffect(() => {
    if (!currentNGO || !schoolId) return;

    const assignments = JSON.parse(sessionStorage.getItem('ngoAssignments') || '[]');
    const found = assignments.find(
      (a: NGOSchoolAssignment) => a.ngoId === currentNGO.id && a.schoolId === schoolId && a.status === 'Active'
    );
    setAssignment(found || null);
  }, [currentNGO, schoolId]);

  const myActivities = activities.filter(
    a => a.ngoId === currentNGO?.id && a.schoolId === schoolId
  );

  const activityTypeOptions = ['Document', 'Assessment', 'Report', 'Photo', 'Reading'];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentNGO || !schoolId || !assignment) {
      alert('Invalid assignment');
      return;
    }

    if (!formData.title || !formData.description || !formData.activityType) {
      alert('Please fill in all required fields');
      return;
    }

    const newActivity: NGOActivity = {
      id: `ACT-${Date.now()}`,
      ngoId: currentNGO.id,
      schoolId,
      assignmentId: assignment.id,
      activityType: formData.activityType,
      title: formData.title,
      description: formData.description,
      date: new Date().toISOString(),
      findings: formData.findings || undefined,
      recommendations: formData.recommendations || undefined,
      fileName: formData.fileName || undefined,
      fileType: formData.fileType || undefined,
      tags: formData.tags,
    };

    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    sessionStorage.setItem('ngoActivities', JSON.stringify(updatedActivities));

    alert('Activity uploaded successfully!');
    setFormData({
      activityType: 'Document',
      title: '',
      description: '',
      findings: '',
      recommendations: '',
      fileName: '',
      fileType: '',
      tags: [],
    });
  };

  if (!currentNGO || !school || !assignment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="bg-card border-border p-8 max-w-md">
          <p className="text-foreground/70 mb-4">Loading activity page...</p>
          <Button onClick={() => router.push('/ngo/dashboard')} className="w-full bg-primary text-primary-foreground">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/ngo/dashboard')}
            className="mb-4 bg-secondary text-foreground hover:bg-secondary/80"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Activity Tracking</h1>
          <p className="text-foreground/70">{school.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Upload New Activity</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Activity Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Activity Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {activityTypeOptions.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, activityType: type as any }))}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          formData.activityType === type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Classroom Observation Report"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What activity did you conduct? What did you observe?"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Findings */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Key Findings</label>
                  <textarea
                    value={formData.findings}
                    onChange={(e) => setFormData(prev => ({ ...prev, findings: e.target.value }))}
                    placeholder="What did you discover? What are the key insights?"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Recommendations */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Recommendations</label>
                  <textarea
                    value={formData.recommendations}
                    onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                    placeholder="What actions should be taken based on your findings?"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* File Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">File Name</label>
                    <input
                      type="text"
                      value={formData.fileName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
                      placeholder="e.g., report.pdf"
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">File Type</label>
                    <input
                      type="text"
                      value={formData.fileType}
                      onChange={(e) => setFormData(prev => ({ ...prev, fileType: e.target.value }))}
                      placeholder="e.g., PDF, Image, Video"
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Tags</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag and press Enter"
                      className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-secondary text-foreground hover:bg-secondary/80 font-semibold"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-primary/70"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-3 rounded-lg"
                >
                  Upload Activity
                </Button>
              </form>
            </Card>
          </div>

          {/* Activity Timeline */}
          <div>
            <Card className="bg-card border-border p-6 sticky top-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Activity History ({myActivities.length})</h3>
              {myActivities.length === 0 ? (
                <p className="text-foreground/70 text-sm">No activities recorded yet.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {myActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(activity => (
                    <div key={activity.id} className="p-3 bg-secondary/50 rounded-lg border border-border">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                          {activity.activityType}
                        </span>
                        <p className="font-semibold text-foreground text-sm flex-1">{activity.title}</p>
                      </div>
                      <p className="text-xs text-foreground/60 mb-2">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      {activity.findings && (
                        <p className="text-xs text-foreground/70 mb-1">
                          <span className="font-semibold">Findings:</span> {activity.findings.substring(0, 50)}...
                        </p>
                      )}
                      {activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {activity.tags.map(tag => (
                            <span key={tag} className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
