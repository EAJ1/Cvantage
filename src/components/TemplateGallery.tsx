import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Eye, Palette, Check, Stars } from 'lucide-react';
import { ResumeData, defaultThemeSettings } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

// Minimal sample data to prevent performance issues
const minimalSampleData: ResumeData = {
  personalInfo: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  },
  summary: 'Experienced Software Engineer with 5+ years developing scalable web applications.',
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead development of user-facing features.',
      achievements: [
        'Improved application performance by 40%',
        'Led team of 4 developers on critical launches'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      graduationDate: '2019-06',
      gpa: '3.8',
      description: 'Focus on Software Engineering',
      achievements: ['Dean\'s List', 'Magna Cum Laude']
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
  selectedTemplate: 'modern',
  themeSettings: defaultThemeSettings
};

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, professional design with customizable accent colors and clear section divisions',
    features: ['ATS-Friendly', 'Professional', 'Color Customizable'],
    defaultColors: { primaryColor: '#2563eb', accentColor: '#3b82f6' }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif font design with center alignment and timeless formal structure',
    features: ['Traditional', 'Formal', 'Serif Typography'],
    defaultColors: { primaryColor: '#374151', accentColor: '#6b7280' }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stunning visual design with gradient backgrounds, floating elements, and modern aesthetics',
    features: ['Creative', 'Visual Impact', 'Gradient Design'],
    defaultColors: { primaryColor: '#7c3aed', accentColor: '#a855f7' }
  }
];

interface TemplateGalleryProps {
  selectedTemplate?: string;
  onTemplateSelect?: (templateId: string) => void;
}

export function TemplateGallery({ selectedTemplate, onTemplateSelect }: TemplateGalleryProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleTemplateSelect = useCallback((templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
      toast.success(`${templates.find(t => t.id === templateId)?.name} template selected!`);
    }
  }, [onTemplateSelect]);

  // Simplified thumbnail rendering for performance
  const renderThumbnail = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    const colors = template?.defaultColors;
    
    return (
      <div className="w-full h-full bg-white p-3 text-gray-900 text-xs border rounded">
        <div className="space-y-2">
          {/* Header simulation */}
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors?.primaryColor || '#374151' }}
            />
            <div className="flex-1 space-y-1">
              <div className="w-16 h-1.5 bg-gray-800 rounded" />
              <div className="w-12 h-1 bg-gray-600 rounded" />
            </div>
          </div>
          
          {/* Content simulation */}
          <div className="space-y-1">
            <div 
              className="w-full h-0.5 rounded"
              style={{ backgroundColor: colors?.accentColor || '#6b7280' }}
            />
            <div className="w-3/4 h-0.5 bg-gray-300 rounded" />
            <div className="w-2/3 h-0.5 bg-gray-300 rounded" />
          </div>
          
          {/* Sections simulation */}
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div className="space-y-0.5">
              <div className="w-full h-0.5 bg-gray-400 rounded" />
              <div className="w-4/5 h-0.5 bg-gray-300 rounded" />
            </div>
            <div className="space-y-0.5">
              <div className="w-full h-0.5 bg-gray-400 rounded" />
              <div className="w-3/5 h-0.5 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

  // Lazy-loaded preview component
  const LazyPreview = useMemo(() => {
    return React.lazy(async () => {
      const { ModernTemplate } = await import('./templates/ModernTemplate');
      const { ClassicTemplate } = await import('./templates/ClassicTemplate');
      const { CreativeTemplate } = await import('./templates/CreativeTemplate');
      
      return {
        default: ({ templateId }: { templateId: string }) => {
          const template = templates.find(t => t.id === templateId);
          if (!template) return <div>Template not found</div>;

          const previewData = {
            ...minimalSampleData,
            selectedTemplate: templateId,
            themeSettings: {
              ...defaultThemeSettings,
              ...template.defaultColors
            }
          };

          switch (templateId) {
            case 'modern':
              return <ModernTemplate data={previewData} />;
            case 'classic':
              return <ClassicTemplate data={previewData} />;
            case 'creative':
              return <CreativeTemplate data={previewData} />;
            default:
              return <div>Template not found</div>;
          }
        }
      };
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="flex items-center justify-center gap-2 mb-4">
          <Palette className="h-6 w-6" />
          Resume Templates
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our collection of professionally designed resume templates. 
          Each template is optimized for ATS systems and provides a unique style to showcase your experience.
          Colors are fully customizable in the theme settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <Card key={template.id} className="group hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  {template.name}
                  {template.id === 'creative' && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <Stars className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {selectedTemplate === template.id && (
                    <Badge variant="default" className="bg-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Preview Thumbnail */}
              <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group-hover:border-primary/50 transition-colors">
                {renderThumbnail(template.id)}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Dialog open={openDialog === template.id} onOpenChange={(open) => setOpenDialog(open ? template.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          {template.name} Template Preview
                        </DialogTitle>
                        <DialogDescription>
                          Preview of the {template.name.toLowerCase()} template with sample resume data.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 border rounded-lg overflow-hidden bg-white">
                        <div className="transform scale-[0.5] origin-top-left w-[200%] h-[200%]">
                          {openDialog === template.id && (
                            <React.Suspense fallback={
                              <div className="flex items-center justify-center h-96">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            }>
                              <LazyPreview templateId={template.id} />
                            </React.Suspense>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    size="sm" 
                    className="flex-1"
                    variant={selectedTemplate === template.id ? "secondary" : "default"}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    {selectedTemplate === template.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      'Use Template'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <h3 className="mb-4">Customization Features</h3>
            <p className="text-muted-foreground mb-6">
              All templates support full color customization through the theme settings. 
              Choose from preset color schemes or create your own custom palette to match your personal brand.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <span className="font-medium">ATS Optimized</span>
                <p className="text-muted-foreground text-center">Passes applicant tracking systems</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <span className="font-medium">Color Customizable</span>
                <p className="text-muted-foreground text-center">Personalize with your brand colors</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <span className="font-medium">Mobile Responsive</span>
                <p className="text-muted-foreground text-center">Looks great on all devices</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded opacity-90" />
                </div>
                <span className="font-medium">Print Ready</span>
                <p className="text-muted-foreground text-center">Professional print quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}