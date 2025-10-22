import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ResumeData } from '../utils/storage';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';

interface ResumePreviewProps {
  resumeData: ResumeData;
  compact?: boolean;
}

export function ResumePreview({ resumeData, compact = false }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (resumeData.selectedTemplate) {
      case 'classic':
        return <ClassicTemplate data={resumeData} />;
      case 'creative':
        return <CreativeTemplate data={resumeData} />;
      case 'modern':
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <h3>Live Preview</h3>
              <Badge variant="outline">{resumeData.selectedTemplate} template</Badge>
            </div>
          </div>
          <div className="transform scale-50 origin-top-left w-[200%] h-[200%] overflow-hidden">
            <div className="bg-white text-black text-xs">
              {renderTemplate()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3>Resume Preview</h3>
        <Badge variant="outline">{resumeData.selectedTemplate} template</Badge>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="bg-white text-black min-h-[297mm] w-full">
            {renderTemplate()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}