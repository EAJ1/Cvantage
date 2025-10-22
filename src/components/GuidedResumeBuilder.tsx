import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
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
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Star,
  Target
} from 'lucide-react';
import { ResumeData, Experience, Education } from '../utils/storage';
import { ResumePreview } from './ResumePreview';
import { AIContentGenerator } from './AIContentGenerator';
import { HelpPanel } from './HelpPanel';
import { MotivationalMessages } from './MotivationalMessages';
import { toast } from 'sonner';

interface GuidedResumeBuilderProps {
  resumeData: ResumeData | null;
  onResumeUpdate: (data: ResumeData) => void;
}

type Step = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'preview';

const steps: { id: Step; title: string; icon: React.ReactNode; color: string; description: string }[] = [
  { 
    id: 'personal', 
    title: 'Personal Info', 
    icon: <User className="h-5 w-5" />, 
    color: 'bg-blue-500',
    description: 'Start with your basic contact information'
  },
  { 
    id: 'summary', 
    title: 'Summary', 
    icon: <Target className="h-5 w-5" />, 
    color: 'bg-green-500',
    description: 'Write a compelling professional summary'
  },
  { 
    id: 'experience', 
    title: 'Work Experience', 
    icon: <Briefcase className="h-5 w-5" />, 
    color: 'bg-purple-500',
    description: 'Add your work history and achievements'
  },
  { 
    id: 'education', 
    title: 'Education', 
    icon: <GraduationCap className="h-5 w-5" />, 
    color: 'bg-orange-500',
    description: 'Include your educational background'
  },
  { 
    id: 'skills', 
    title: 'Skills', 
    icon: <Award className="h-5 w-5" />, 
    color: 'bg-pink-500',
    description: 'Showcase your technical and soft skills'
  },
  { 
    id: 'preview', 
    title: 'Preview', 
    icon: <Eye className="h-5 w-5" />, 
    color: 'bg-indigo-500',
    description: 'Review and finalize your resume'
  }
];

export function GuidedResumeBuilder({ resumeData, onResumeUpdate }: GuidedResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

  // Helper functions for updating data
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
    checkStepCompletion('personal', updated);
  };

  const handleSummaryChange = (value: string) => {
    if (!resumeData) return;
    const updated = { ...resumeData, summary: value };
    onResumeUpdate(updated);
    checkStepCompletion('summary', updated);
  };

  const checkStepCompletion = (step: Step, data: ResumeData) => {
    let isComplete = false;
    
    switch (step) {
      case 'personal':
        isComplete = !!(data.personalInfo.name && data.personalInfo.email);
        break;
      case 'summary':
        isComplete = !!(data.summary && data.summary.length > 20);
        break;
      case 'experience':
        isComplete = data.experience.length > 0 && data.experience.every(exp => 
          exp.jobTitle && exp.company && exp.startDate
        );
        break;
      case 'education':
        isComplete = data.education.length > 0 && data.education.every(edu => 
          edu.degree && edu.institution
        );
        break;
      case 'skills':
        isComplete = data.skills.length >= 3;
        break;
    }

    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (isComplete) {
        newSet.add(step);
      } else {
        newSet.delete(step);
      }
      return newSet;
    });
  };

  const getStepProgress = () => {
    return (completedSteps.size / 5) * 100;
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Profile picture upload
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !resumeData) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      handlePersonalInfoChange('profilePicture', base64);
      toast.success('Profile picture uploaded successfully! 📸');
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    if (!resumeData) return;
    handlePersonalInfoChange('profilePicture', '');
    toast.success('Profile picture removed');
  };

  // Experience functions
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
    
    const updated = {
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    };
    onResumeUpdate(updated);
    toast.success('New work experience added! 💼');
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    if (!resumeData) return;
    
    const updated = {
      ...resumeData,
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    };
    
    onResumeUpdate(updated);
    checkStepCompletion('experience', updated);
  };

  const removeExperience = (id: string) => {
    if (!resumeData) return;
    
    const updated = {
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    };
    onResumeUpdate(updated);
    checkStepCompletion('experience', updated);
    toast.success('Work experience removed');
  };

  // Education functions
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
    
    const updated = {
      ...resumeData,
      education: [...resumeData.education, newEducation]
    };
    onResumeUpdate(updated);
    toast.success('New education added! 🎓');
  };

  const updateEducation = (id: string, field: string, value: string) => {
    if (!resumeData) return;
    
    const updated = {
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    };
    
    onResumeUpdate(updated);
    checkStepCompletion('education', updated);
  };

  const removeEducation = (id: string) => {
    if (!resumeData) return;
    
    const updated = {
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    };
    onResumeUpdate(updated);
    checkStepCompletion('education', updated);
    toast.success('Education removed');
  };

  // Skills functions
  const addSkill = (skill: string) => {
    if (!resumeData || !skill.trim()) return;
    
    const skills = skill.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const updatedSkills = [...new Set([...resumeData.skills, ...skills])];
    
    const updated = { ...resumeData, skills: updatedSkills };
    onResumeUpdate(updated);
    checkStepCompletion('skills', updated);
    toast.success(`${skills.length > 1 ? 'Skills' : 'Skill'} added! ⭐`);
  };

  const removeSkill = (skill: string) => {
    if (!resumeData) return;
    
    const updated = {
      ...resumeData,
      skills: resumeData.skills.filter(s => s !== skill)
    };
    onResumeUpdate(updated);
    checkStepCompletion('skills', updated);
  };

  if (!resumeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your resume builder...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resume Preview 👀
            </h2>
            <p className="text-muted-foreground">How your resume will look to employers</p>
          </div>
          <Button onClick={() => setShowPreview(false)} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </div>
        <ResumePreview resumeData={resumeData} />
      </div>
    );
  }

  const currentStepData = steps.find(s => s.id === currentStep);
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            CVantage
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg">
            Create your professional resume step by step - we'll guide you through it
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div>
                <h3 className="font-semibold text-base lg:text-lg">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedSteps.size} of 5 sections completed
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl lg:text-2xl font-bold text-primary">
                  {Math.round(getStepProgress())}%
                </div>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={getStepProgress()} className="h-2 lg:h-3 mb-4" />
            <div className="hidden lg:flex justify-between">
              {steps.slice(0, 5).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                    ${completedSteps.has(step.id) ? 'bg-primary' : step.id === currentStep ? 'bg-primary' : 'bg-muted'}
                  `}>
                    {completedSteps.has(step.id) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step.id === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-1 lg:space-x-2 p-2 bg-card rounded-full shadow-sm border overflow-x-auto">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentStep(step.id)}
                className={`
                  flex items-center space-x-1 lg:space-x-2 rounded-full transition-all flex-shrink-0 px-2 lg:px-3
                  ${completedSteps.has(step.id) ? 'border border-primary/30' : ''}
                `}
              >
                {completedSteps.has(step.id) ? <CheckCircle className="h-4 w-4" /> : step.icon}
                <span className="hidden sm:inline text-xs lg:text-sm">{step.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Help Panel - Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1 space-y-6">
            <HelpPanel currentStep={currentStep} />
            <MotivationalMessages progress={getStepProgress()} currentStep={currentStep} />
          </div>
          
          {/* Main Content */}
          <Card className="lg:col-span-3 order-1 lg:order-2 shadow-sm overflow-visible">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                {currentStepData?.icon}
                <div>
                  <CardTitle className="text-lg lg:text-xl">{currentStepData?.title}</CardTitle>
                  <p className="text-primary-foreground/90 text-sm">{currentStepData?.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground self-start sm:self-auto">
                Step {currentStepIndex + 1} of {steps.length}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 lg:p-8 overflow-visible">
              {/* Personal Information Step */}
              {currentStep === 'personal' && (
                <div className="space-y-8">
                  <Alert className="border-primary/20 bg-primary/5">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Tip:</strong> Use your professional information as it appears on official documents. 
                      This section is the foundation of your resume!
                    </AlertDescription>
                  </Alert>

                  {/* Profile Picture */}
                  <div className="text-center">
                    <Label className="text-base lg:text-lg font-semibold mb-4 block">Profile Picture (Optional)</Label>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 lg:gap-6">
                      {resumeData.personalInfo.profilePicture ? (
                        <div className="relative">
                          <img
                            src={resumeData.personalInfo.profilePicture}
                            alt="Profile"
                            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-primary/20 shadow-sm"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 lg:h-8 lg:w-8 rounded-full p-0 shadow-sm"
                            onClick={removeProfilePicture}
                          >
                            <X className="h-3 w-3 lg:h-4 lg:w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-muted flex items-center justify-center border-4 border-dashed border-border">
                          <User className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="profile-picture" className="cursor-pointer">
                          <div className="flex items-center space-x-2 p-3 border-2 border-dashed border-border rounded-lg hover:bg-muted/50 transition-colors">
                            <Upload className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                            <span className="text-primary font-medium text-sm lg:text-base">
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
                        <p className="text-xs text-muted-foreground mt-1">
                          Professional headshot recommended
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-semibold">Full Name *</Label>
                        <Input
                          id="name"
                          value={resumeData.personalInfo.name}
                          onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                          placeholder="John Smith"
                          className="border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                          placeholder="john.smith@email.com"
                          className="border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-semibold">Phone Number</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                          placeholder="+27 82 123 4567"
                          className="border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="font-semibold">Location</Label>
                        <Input
                          id="location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                          placeholder="Cape Town, South Africa"
                          className="border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="font-semibold">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/johnsmith"
                          className="border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="website" className="font-semibold">Website/Portfolio</Label>
                        <Input
                          id="website"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                          placeholder="johnsmith.com"
                          className="border-2 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Summary Step */}
              {currentStep === 'summary' && (
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                    <Star className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Professional Summary:</strong> Write a compelling summary that highlights your key qualifications and career goals.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="summary" className="text-lg font-semibold">Professional Summary *</Label>
                    </div>
                    <Textarea
                      id="summary"
                      value={resumeData.summary}
                      onChange={(e) => handleSummaryChange(e.target.value)}
                      placeholder="A dedicated professional with [X years] of experience in [your field]. Skilled in [key skills] with a proven track record of [key achievement]. Seeking to leverage my expertise in [specific area] to drive success at [type of company]."
                      className="min-h-32 border-2 focus:border-green-400 transition-colors"
                      rows={4}
                    />
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">
                        {resumeData.summary.length}/200 characters (aim for 50-150 words)
                      </p>
                      {resumeData.summary.length > 20 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Looking good!
                        </Badge>
                      )}
                    </div>
                  </div>

                  <AIContentGenerator 
                    type="summary" 
                    onContentGenerated={(content) => handleSummaryChange(content)}
                    context={{
                      jobTitle: resumeData.experience[0]?.jobTitle || '',
                      industry: '',
                      skills: resumeData.skills.slice(0, 3)
                    }}
                  />
                </div>
              )}

              {/* Work Experience Step */}
              {currentStep === 'experience' && (
                <div className="space-y-6">
                  <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950">
                    <Briefcase className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Work Experience:</strong> Start with your most recent position. Focus on achievements and quantifiable results rather than just responsibilities.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button onClick={addExperience} className="bg-purple-500 hover:bg-purple-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>

                  {resumeData.experience.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No work experience added yet</h4>
                      <p className="text-muted-foreground mb-4">Add your work history to showcase your professional journey</p>
                      <Button onClick={addExperience} className="bg-purple-500 hover:bg-purple-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Job
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, index) => (
                        <Card key={exp.id} className="border-l-4 border-l-purple-500">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  #{index + 1}
                                </Badge>
                                <h4 className="font-semibold">
                                  {exp.jobTitle || 'Untitled Position'}
                                </h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(exp.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`job-title-${exp.id}`} className="font-semibold">Job Title *</Label>
                                <Input
                                  id={`job-title-${exp.id}`}
                                  value={exp.jobTitle}
                                  onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                                  placeholder="Software Developer"
                                  className="border-2 focus:border-purple-400 transition-colors"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`company-${exp.id}`} className="font-semibold">Company *</Label>
                                <Input
                                  id={`company-${exp.id}`}
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                  placeholder="Tech Solutions Inc."
                                  className="border-2 focus:border-purple-400 transition-colors"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`location-${exp.id}`} className="font-semibold">Location</Label>
                                <Input
                                  id={`location-${exp.id}`}
                                  value={exp.location}
                                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                  placeholder="Cape Town, South Africa"
                                  className="border-2 focus:border-purple-400 transition-colors"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor={`start-date-${exp.id}`} className="font-semibold">Start Date *</Label>
                                  <Input
                                    id={`start-date-${exp.id}`}
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    placeholder="Jan 2022"
                                    className="border-2 focus:border-purple-400 transition-colors"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`end-date-${exp.id}`} className="font-semibold">End Date</Label>
                                  <Input
                                    id={`end-date-${exp.id}`}
                                    value={exp.current ? 'Present' : exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    placeholder="Present"
                                    disabled={exp.current}
                                    className="border-2 focus:border-purple-400 transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.current}
                                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                              />
                              <Label htmlFor={`current-${exp.id}`} className="text-sm">
                                I currently work here
                              </Label>
                            </div>

                            <div>
                              <Label htmlFor={`description-${exp.id}`} className="font-semibold">Job Description</Label>
                              <Textarea
                                id={`description-${exp.id}`}
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                placeholder="Describe your role, responsibilities, and key achievements. Use bullet points and start with action verbs."
                                className="min-h-24 border-2 focus:border-purple-400 transition-colors"
                                rows={3}
                              />
                            </div>

                            <AIContentGenerator 
                              type="experience" 
                              onContentGenerated={(content) => updateExperience(exp.id, 'description', content)}
                              context={{
                                jobTitle: exp.jobTitle,
                                company: exp.company,
                                industry: '',
                                skills: resumeData.skills.slice(0, 5)
                              }}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Education Step */}
              {currentStep === 'education' && (
                <div className="space-y-6">
                  <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                    <GraduationCap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Education:</strong> Include your highest degree first. Add relevant coursework, honors, or achievements if they strengthen your application.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button onClick={addEducation} className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>

                  {resumeData.education.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                      <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No education added yet</h4>
                      <p className="text-muted-foreground mb-4">Add your educational background and qualifications</p>
                      <Button onClick={addEducation} className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {resumeData.education.map((edu, index) => (
                        <Card key={edu.id} className="border-l-4 border-l-orange-500">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  #{index + 1}
                                </Badge>
                                <h4 className="font-semibold">
                                  {edu.degree || 'Untitled Degree'}
                                </h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`degree-${edu.id}`} className="font-semibold">Degree *</Label>
                                <Input
                                  id={`degree-${edu.id}`}
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  placeholder="Bachelor of Science in Computer Science"
                                  className="border-2 focus:border-orange-400 transition-colors"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`institution-${edu.id}`} className="font-semibold">Institution *</Label>
                                <Input
                                  id={`institution-${edu.id}`}
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                  placeholder="University of Cape Town"
                                  className="border-2 focus:border-orange-400 transition-colors"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`edu-location-${edu.id}`} className="font-semibold">Location</Label>
                                <Input
                                  id={`edu-location-${edu.id}`}
                                  value={edu.location}
                                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                  placeholder="Cape Town, South Africa"
                                  className="border-2 focus:border-orange-400 transition-colors"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`graduation-date-${edu.id}`} className="font-semibold">Graduation Date</Label>
                                <Input
                                  id={`graduation-date-${edu.id}`}
                                  value={edu.graduationDate}
                                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                                  placeholder="May 2022"
                                  className="border-2 focus:border-orange-400 transition-colors"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor={`gpa-${edu.id}`} className="font-semibold">GPA (Optional)</Label>
                              <Input
                                id={`gpa-${edu.id}`}
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                placeholder="3.8/4.0"
                                className="border-2 focus:border-orange-400 transition-colors"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`edu-description-${edu.id}`} className="font-semibold">Additional Details</Label>
                              <Textarea
                                id={`edu-description-${edu.id}`}
                                value={edu.description}
                                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                placeholder="Relevant coursework, honors, achievements, thesis title, etc."
                                className="min-h-20 border-2 focus:border-orange-400 transition-colors"
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Step */}
              {currentStep === 'skills' && (
                <div className="space-y-6">
                  <Alert className="border-pink-200 bg-pink-50 dark:bg-pink-950">
                    <Award className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Skills:</strong> Include both technical skills and soft skills relevant to your target role. Be specific and honest about your proficiency levels.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Skills *</Label>
                    
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          id="new-skill"
                          placeholder="Add skills (separate multiple skills with commas)"
                          className="border-2 focus:border-pink-400 transition-colors"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              addSkill(input.value);
                              input.value = '';
                            }
                          }}
                        />
                        <Button 
                          onClick={() => {
                            const input = document.getElementById('new-skill') as HTMLInputElement;
                            addSkill(input.value);
                            input.value = '';
                          }}
                          className="bg-pink-500 hover:bg-pink-600 flex-shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skills
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Examples: JavaScript, Python, Project Management, Communication, Data Analysis
                      </p>
                    </div>

                    {resumeData.skills.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Your Skills ({resumeData.skills.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-2 bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200 transition-colors group cursor-pointer"
                              onClick={() => removeSkill(skill)}
                            >
                              {skill}
                              <X className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click on a skill to remove it
                        </p>
                      </div>
                    )}

                    {resumeData.skills.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="text-lg font-semibold mb-2">No skills added yet</h4>
                        <p className="text-muted-foreground">Add your technical and soft skills to showcase your abilities</p>
                      </div>
                    )}

                    <AIContentGenerator 
                      type="skills" 
                      onContentGenerated={(content) => addSkill(content)}
                      context={{
                        jobTitle: resumeData.experience[0]?.jobTitle || '',
                        industry: '',
                        skills: resumeData.skills
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Preview Step */}
              {currentStep === 'preview' && (
                <div className="space-y-6">
                  <Alert className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950">
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Preview:</strong> Review your resume and make any final adjustments. Check for typos, formatting, and completeness.
                    </AlertDescription>
                  </Alert>

                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Your Resume is Ready! 🎉</h3>
                    <p className="text-muted-foreground">
                      Take a moment to review everything and make sure it looks perfect.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={() => setShowPreview(true)}
                        size="lg"
                        className="bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        Preview Resume
                      </Button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-primary">{completedSteps.size}/5</div>
                      <p className="text-sm text-muted-foreground">Sections Complete</p>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-primary">{resumeData.experience.length}</div>
                      <p className="text-sm text-muted-foreground">Work Experiences</p>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-primary">{resumeData.education.length}</div>
                      <p className="text-sm text-muted-foreground">Education Entries</p>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold text-primary">{resumeData.skills.length}</div>
                      <p className="text-sm text-muted-foreground">Skills Listed</p>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <div className="flex space-x-2">
                  {currentStep !== 'preview' && (
                    <Button
                      onClick={nextStep}
                      disabled={currentStepIndex === steps.length - 1}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {currentStep === 'preview' && (
                    <Button 
                      onClick={() => setShowPreview(true)}
                      className="bg-indigo-500 hover:bg-indigo-600 flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Resume</span>
                    </Button>
                  )}
                </div>
              </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}