import React, { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Target,
  Download,
  Eye,
  Sparkles,
  BarChart3,
  Settings,
  Plus,
  Moon,
  Sun,
  Palette,
  HelpCircle
} from 'lucide-react';
import { GuidedResumeBuilder } from './components/GuidedResumeBuilder';
import { JobAnalyzer } from './components/JobAnalyzer';
import { TemplateGallery } from './components/TemplateGallery';
import { ExportMenu } from './components/ExportMenu';
import { ThemeSettings } from './components/ThemeSettings';
import { loadResumeData, saveResumeData, ResumeData, loadThemeSettings, saveThemeSettings, ThemeSettings as ThemeSettingsType } from './utils/storage';
import { OnboardingTour } from './components/OnboardingTour';
import { toast, Toaster } from 'sonner';

type View = 'dashboard' | 'builder' | 'templates' | 'analyzer' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    try {
      const data = loadResumeData();
      const theme = loadThemeSettings();
      
      setResumeData(data);
      setThemeSettings(theme);
      
      // Check if this is a first-time user
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding && !data) {
        setShowOnboarding(true);
      }
      
      // Apply initial dark mode class
      if (theme.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Error loading application data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Watch for theme changes and apply dark mode class
  useEffect(() => {
    if (themeSettings) {
      if (themeSettings.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [themeSettings?.isDarkMode]);

  // Custom cursor effect
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const moveCursor = () => {
      const speed = 0.15;
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      
      cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
      requestAnimationFrame(moveCursor);
    };

    const createTrail = (x: number, y: number) => {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = x - 3 + 'px';
      trail.style.top = y - 3 + 'px';
      document.body.appendChild(trail);
      
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      }, 800);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Create trail effect occasionally
      if (Math.random() < 0.3) {
        createTrail(e.clientX, e.clientY);
      }
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    moveCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
      // Clean up any remaining trail elements
      const trails = document.querySelectorAll('.cursor-trail');
      trails.forEach(trail => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      });
    };
  }, []);

  const handleResumeUpdate = (data: ResumeData) => {
    try {
      setResumeData(data);
      saveResumeData(data);
    } catch (error) {
      console.error('Error saving resume data:', error);
      toast.error('Error saving resume data');
    }
  };

  const handleThemeChange = (settings: ThemeSettingsType) => {
    try {
      setThemeSettings(settings);
      if (resumeData) {
        const updatedResume = { ...resumeData, themeSettings: settings };
        setResumeData(updatedResume);
        saveResumeData(updatedResume);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Error updating theme');
    }
  };

  const toggleDarkMode = () => {
    if (!themeSettings) return;
    try {
      const newSettings = { ...themeSettings, isDarkMode: !themeSettings.isDarkMode };
      
      // Apply dark mode class immediately
      if (newSettings.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      handleThemeChange(newSettings);
      saveThemeSettings(newSettings);
    } catch (error) {
      console.error('Error toggling dark mode:', error);
      toast.error('Error toggling dark mode');
    }
  };

  const calculateProgress = () => {
    if (!resumeData) return 0;
    
    let completed = 0;
    let total = 5;
    
    // Personal info
    if (resumeData.personalInfo.name && resumeData.personalInfo.email) completed++;
    
    // Experience
    if (resumeData.experience.length > 0) completed++;
    
    // Education  
    if (resumeData.education.length > 0) completed++;
    
    // Skills
    if (resumeData.skills.length > 0) completed++;
    
    // Summary
    if (resumeData.summary) completed++;
    
    return (completed / total) * 100;
  };

  const renderNavigation = () => (
    <div className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                CVantage
              </span>
            </div>
            <div className="lg:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="rounded-full"
              >
                {themeSettings?.isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              {resumeData && (
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  {Math.round(calculateProgress())}%
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <nav className="flex flex-wrap gap-1">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className="flex-1 sm:flex-none"
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === 'builder' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('builder')}
                className="flex-1 sm:flex-none"
              >
                Builder
              </Button>
              <Button
                variant={currentView === 'templates' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('templates')}
                className="flex-1 sm:flex-none"
              >
                Templates
              </Button>
              <Button
                variant={currentView === 'analyzer' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('analyzer')}
                className="flex-1 sm:flex-none"
              >
                Analyzer
              </Button>
            </nav>
            
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowOnboarding(true);
                  toast.info('Starting the helpful tour!');
                }}
                className="rounded-full"
                title="Show Help Tour"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="rounded-full"
              >
                {themeSettings?.isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant={currentView === 'settings' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('settings')}
              >
                <Palette className="h-4 w-4" />
              </Button>
              {resumeData && (
                <Badge variant="secondary" className="px-3 py-1 whitespace-nowrap">
                  {Math.round(calculateProgress())}% Complete
                </Badge>
              )}
              <ExportMenu resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Welcome to CVantage
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-4">
            Create professional, ATS-friendly resumes in minutes. Our step-by-step guide makes it easy, 
            even if you've never built a resume before.
          </p>
        </div>

      {resumeData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <BarChart3 className="h-5 w-5 flex-shrink-0" />
                <span>Progress</span>
              </CardTitle>
              <CardDescription className="text-sm">Complete sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={calculateProgress()} className="w-full h-2" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {Math.round(calculateProgress())}% complete
                </p>
                <Badge variant="secondary" className="text-xs">
                  {calculateProgress() === 100 ? 'Complete' : 'In Progress'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Target className="h-5 w-5 flex-shrink-0" />
                <span>ATS Score</span>
              </CardTitle>
              <CardDescription className="text-sm">Optimization rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85/100</div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <Sparkles className="h-4 w-4 mr-1 flex-shrink-0" />
                Great compatibility
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm md:col-span-2 xl:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span>Template</span>
              </CardTitle>
              <CardDescription className="text-sm">Current design</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="px-3 py-1 text-xs">
                {resumeData.selectedTemplate === 'modern' && 'Modern'}
                {resumeData.selectedTemplate === 'classic' && 'Classic'}
                {resumeData.selectedTemplate === 'creative' && 'Creative'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center p-6 lg:p-12 shadow-sm">
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="relative">
              <FileText className="h-16 w-16 lg:h-20 lg:w-20 mx-auto text-primary mb-4" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-bold">
                Ready to Create Your First Resume?
              </h3>
              <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto">
                Don't worry if you're new to this - our step-by-step guide will help you create a professional resume in minutes.
              </p>
            </div>
            <Button 
              onClick={() => setCurrentView('builder')} 
              size="lg"
              className="text-base lg:text-lg px-6 lg:px-8 py-2 lg:py-3"
            >
              <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Start Building My Resume
            </Button>
            <p className="text-xs lg:text-sm text-muted-foreground max-w-md mx-auto">
              Takes about 10-15 minutes • No experience required • AI-powered assistance
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-300 group" onClick={() => setCurrentView('builder')}>
          <CardContent className="p-4 lg:p-6 text-center space-y-3">
            <div className="bg-primary w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <User className="h-6 w-6 lg:h-8 lg:w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold">Resume Builder</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">Step-by-step guide</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-300 group" onClick={() => setCurrentView('templates')}>
          <CardContent className="p-4 lg:p-6 text-center space-y-3">
            <div className="bg-primary w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold">Templates</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">Professional designs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-300 group" onClick={() => setCurrentView('analyzer')}>
          <CardContent className="p-4 lg:p-6 text-center space-y-3">
            <div className="bg-primary w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Target className="h-6 w-6 lg:h-8 lg:w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold">Job Analyzer</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">Match to jobs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-300 group" onClick={() => setCurrentView('settings')}>
          <CardContent className="p-4 lg:p-6 text-center space-y-3">
            <div className="bg-primary w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Settings className="h-6 w-6 lg:h-8 lg:w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold">Settings</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">Customize theme</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl lg:text-2xl">
            Why Choose Our Resume Builder?
          </CardTitle>
          <CardDescription className="text-base lg:text-lg">Everything you need to create the perfect resume - made simple</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="flex flex-col items-center space-y-3 text-center p-4 lg:p-6 rounded-lg border">
              <div className="bg-primary w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
              <h4 className="text-sm lg:text-base font-bold">AI-Powered Content</h4>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Get professional suggestions generated instantly
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center p-4 lg:p-6 rounded-lg border">
              <div className="bg-primary w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
              <h4 className="text-sm lg:text-base font-bold">ATS Optimized</h4>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Pass through tracking systems with confidence
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center p-4 lg:p-6 rounded-lg border">
              <div className="bg-primary w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
                <Download className="h-5 w-5 lg:h-6 lg:w-6 text-primary-foreground" />
              </div>
              <h4 className="text-sm lg:text-base font-bold">Multiple Formats</h4>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Download as PDF, Word, or HTML
              </p>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-8 text-center">
            <Button 
              onClick={() => setCurrentView('builder')} 
              size="lg"
              className="text-base lg:text-lg px-6 lg:px-8 py-2 lg:py-3"
            >
              Get Started Now - It's Free
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('hasSeenOnboarding', 'true');
            setCurrentView('builder');
            toast.success('Welcome! Let\'s build your resume!');
          }}
          onSkip={() => {
            setShowOnboarding(false);
            localStorage.setItem('hasSeenOnboarding', 'true');
            toast.info('You can always restart the tour from settings');
          }}
        />
      )}
    </div>
  );
    </div>
  );

  const renderSettings = () => (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="flex items-center justify-center gap-2 mb-2 lg:mb-4 text-xl lg:text-2xl">
            <Palette className="h-5 w-5 lg:h-6 lg:w-6" />
            Theme & Appearance Settings
          </h2>
          <p className="text-muted-foreground text-sm lg:text-base">
            Customize the appearance of your resume templates with colors and themes.
          </p>
        </div>
        {themeSettings && (
          <ThemeSettings 
            themeSettings={themeSettings} 
            onThemeChange={handleThemeChange} 
          />
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CVantage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderNavigation()}
      
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'builder' && (
        <GuidedResumeBuilder 
          resumeData={resumeData}
          onResumeUpdate={handleResumeUpdate}
        />
      )}
      {currentView === 'templates' && <TemplateGallery selectedTemplate={resumeData?.selectedTemplate} onTemplateSelect={(templateId) => {
        if (resumeData) {
          const updatedData = { ...resumeData, selectedTemplate: templateId };
          handleResumeUpdate(updatedData);
          toast.success(`Switched to ${templateId} template`);
        }
      }} />}
      {currentView === 'analyzer' && <JobAnalyzer resumeData={resumeData} />}
      {currentView === 'settings' && renderSettings()}
      
      <Toaster position="top-right" />
    </div>
  );
}