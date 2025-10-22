import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  Trash2,
  Sparkles,
  Eye,
  Upload,
  X
} from 'lucide-react';
import { ResumeData, Experience, Education } from '../utils/storage';
import { ResumePreview } from './ResumePreview';
import { AIContentGenerator } from './AIContentGenerator';
import { toast } from 'sonner';

interface ResumeBuilderProps {
  resumeData: ResumeData | null;
  onResumeUpdate: (data: ResumeData) => void;
}

export function ResumeBuilder({ resumeData, onResumeUpdate }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);

  const handlePersonalInfoChange = (field: string, value: string) => {
    if (!resumeData) return;
    
    const updated = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    };
    onResumeUpdate(updated);
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !resumeData) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      handlePersonalInfoChange('profilePicture', base64);
      toast.success('Profile picture uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    if (!resumeData) return;
    handlePersonalInfoChange('profilePicture', '');
    toast.success('Profile picture removed');
  };

  const handleSummaryChange = (value: string) => {
    if (!resumeData) return;
    onResumeUpdate({ ...resumeData, summary: value });
  };

  const addExperience = () => {
    if (!resumeData) return;
    
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    
    onResumeUpdate({
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    if (!resumeData) return;
    
    const updated = resumeData.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    
    onResumeUpdate({ ...resumeData, experience: updated });
  };

  const removeExperience = (id: string) => {
    if (!resumeData) return;
    
    const updated = resumeData.experience.filter(exp => exp.id !== id);
    onResumeUpdate({ ...resumeData, experience: updated });
  };

  const addExperienceAchievement = (expId: string, achievement: string) => {
    if (!resumeData || !achievement.trim()) return;
    
    const updated = resumeData.experience.map(exp =>
      exp.id === expId 
        ? { ...exp, achievements: [...exp.achievements, achievement.trim()] }
        : exp
    );
    
    onResumeUpdate({ ...resumeData, experience: updated });
  };

  const removeExperienceAchievement = (expId: string, index: number) => {
    if (!resumeData) return;
    
    const updated = resumeData.experience.map(exp =>
      exp.id === expId 
        ? { ...exp, achievements: exp.achievements.filter((_, i) => i !== index) }
        : exp
    );
    
    onResumeUpdate({ ...resumeData, experience: updated });
  };

  const addEducation = () => {
    if (!resumeData) return;
    
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
      description: '',
      achievements: []
    };
    
    onResumeUpdate({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    if (!resumeData) return;
    
    const updated = resumeData.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    
    onResumeUpdate({ ...resumeData, education: updated });
  };

  const removeEducation = (id: string) => {
    if (!resumeData) return;
    
    const updated = resumeData.education.filter(edu => edu.id !== id);
    onResumeUpdate({ ...resumeData, education: updated });
  };

  const addEducationAchievement = (eduId: string, achievement: string) => {
    if (!resumeData || !achievement.trim()) return;
    
    const updated = resumeData.education.map(edu =>
      edu.id === eduId 
        ? { ...edu, achievements: [...edu.achievements, achievement.trim()] }
        : edu
    );
    
    onResumeUpdate({ ...resumeData, education: updated });
  };

  const removeEducationAchievement = (eduId: string, index: number) => {
    if (!resumeData) return;
    
    const updated = resumeData.education.map(edu =>
      edu.id === eduId 
        ? { ...edu, achievements: edu.achievements.filter((_, i) => i !== index) }
        : edu
    );
    
    onResumeUpdate({ ...resumeData, education: updated });
  };

  const addSkill = (skill: string) => {
    if (!resumeData || !skill.trim()) return;
    
    const skills = skill.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const updatedSkills = [...new Set([...resumeData.skills, ...skills])];
    
    onResumeUpdate({ ...resumeData, skills: updatedSkills });
  };

  const removeSkill = (skill: string) => {
    if (!resumeData) return;
    
    const updated = resumeData.skills.filter(s => s !== skill);
    onResumeUpdate({ ...resumeData, skills: updated });
  };

  if (!resumeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Loading resume builder...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex justify-between items-center">
          <h2>Resume Preview</h2>
          <Button onClick={() => setShowPreview(false)}>
            Back to Editor
          </Button>
        </div>
        <ResumePreview resumeData={resumeData} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2>Resume Builder</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Picture Upload */}
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      {resumeData.personalInfo.profilePicture ? (
                        <div className="relative">
                          <img
                            src={resumeData.personalInfo.profilePicture}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={removeProfilePicture}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="profile-picture" className="cursor-pointer">
                          <div className="flex items-center space-x-2 p-2 border border-dashed rounded-lg hover:bg-muted">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">
                              {resumeData.personalInfo.profilePicture ? 'Change Photo' : 'Upload Photo'}
                            </span>
                          </div>
                        </Label>
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={resumeData.personalInfo.website}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        placeholder="johndoe.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={resumeData.summary}
                      onChange={(e) => handleSummaryChange(e.target.value)}
                      placeholder="Write a brief summary of your professional background and career objectives..."
                      rows={4}
                    />
                    <AIContentGenerator
                      type="summary"
                      context={{ jobTitle: 'Software Engineer', industry: 'Technology' }}
                      onGenerate={(content) => handleSummaryChange(content)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Work Experience</CardTitle>
                    <Button onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.experience.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No work experience added yet. Click "Add Experience" to get started.
                    </p>
                  ) : (
                    resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline">Experience #{index + 1}</Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title *</Label>
                            <Input
                              value={exp.jobTitle}
                              onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                              placeholder="Software Engineer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company *</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              placeholder="Tech Corp"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                              placeholder="San Francisco, CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              disabled={exp.current}
                              placeholder={exp.current ? 'Present' : ''}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          />
                          <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
                        </div>

                        <div className="space-y-2">
                          <Label>Job Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="Describe your role and responsibilities..."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Key Achievements</Label>
                          <div className="space-y-2">
                            {exp.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex items-center space-x-2">
                                <div className="flex-1 p-2 bg-muted rounded">
                                  {achievement}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperienceAchievement(exp.id, achIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Add a key achievement..."
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addExperienceAchievement(exp.id, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <AIContentGenerator
                                type="bullet"
                                context={{ jobTitle: exp.jobTitle, company: exp.company }}
                                onGenerate={(content) => addExperienceAchievement(exp.id, content)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Education</CardTitle>
                    <Button onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.education.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No education added yet. Click "Add Education" to get started.
                    </p>
                  ) : (
                    resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline">Education #{index + 1}</Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree *</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="Bachelor of Science in Computer Science"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Institution *</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="University of Technology"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                              placeholder="San Francisco, CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Graduation Date</Label>
                            <Input
                              type="month"
                              value={edu.graduationDate}
                              onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>GPA</Label>
                            <Input
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="3.8/4.0"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={edu.description || ''}
                            onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                            placeholder="Relevant coursework, thesis, honors..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Achievements & Awards</Label>
                          <div className="space-y-2">
                            {edu.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex items-center space-x-2">
                                <div className="flex-1 p-2 bg-muted rounded">
                                  {achievement}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEducationAchievement(edu.id, achIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Input
                              placeholder="Add an achievement (Dean's List, Summa Cum Laude, etc.)..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addEducationAchievement(edu.id, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Skills</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter skills separated by commas..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <AIContentGenerator
                        type="skills"
                        context={{ jobTitle: 'Software Engineer', industry: 'Technology' }}
                        onGenerate={(content) => addSkill(content)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    {resumeData.skills.length === 0 && (
                      <p className="text-muted-foreground text-sm">No skills added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ResumePreview resumeData={resumeData} compact />
          </div>
        </div>
      </div>
    </div>
  );
}