import React from 'react';
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Download, FileText, File, Globe } from 'lucide-react';
import { ResumeData } from '../utils/storage';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { toast } from 'sonner@2.0.3';

interface ExportMenuProps {
  resumeData: ResumeData | null;
}

export function ExportMenu({ resumeData }: ExportMenuProps) {
  const exportToPDF = async () => {
    if (!resumeData) {
      toast.error('No resume data to export');
      return;
    }
    
    try {
      // Generate HTML content with the selected template
      const htmlContent = generateTemplateHTML(resumeData);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups to export PDF');
        return;
      }
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // Note: User will need to choose "Save as PDF" in the print dialog
      };
      
      toast.success('PDF export opened in new window. Choose "Save as PDF" in the print dialog.');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error exporting PDF');
    }
  };

  const exportToHTML = () => {
    if (!resumeData) {
      toast.error('No resume data to export');
      return;
    }
    
    try {
      const htmlContent = generateTemplateHTML(resumeData);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.name?.replace(/\s+/g, '_') || 'resume'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Resume exported as HTML');
    } catch (error) {
      console.error('Error exporting HTML:', error);
      toast.error('Error exporting HTML');
    }
  };

  const exportToDOCX = () => {
    if (!resumeData) {
      toast.error('No resume data to export');
      return;
    }
    
    try {
      // Generate rich text format content that can be opened by Word
      const rtfContent = generateRTFContent(resumeData);
      const blob = new Blob([rtfContent], { type: 'application/rtf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.name?.replace(/\s+/g, '_') || 'resume'}.rtf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Resume exported as RTF (opens in Word)');
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      toast.error('Error exporting document');
    }
  };

  const generateTemplateHTML = (data: ResumeData) => {
    const primaryColor = data.themeSettings?.primaryColor || '#2563eb';
    const accentColor = data.themeSettings?.accentColor || '#3b82f6';
    const selectedTemplate = data.selectedTemplate || 'modern';
    const isStarsTheme = primaryColor === '#0f172a' || primaryColor === '#1e3a8a';
    
    // Format date helper
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Generate template-specific HTML
    switch (selectedTemplate) {
      case 'creative':
        return generateCreativeHTML(data, primaryColor, accentColor, formatDate, isStarsTheme);
      case 'classic':
        return generateClassicHTML(data, primaryColor, accentColor, formatDate);
      case 'modern':
      default:
        return generateModernHTML(data, primaryColor, accentColor, formatDate);
    }
  };

  // Modern Template HTML Generator
  const generateModernHTML = (data: ResumeData, primaryColor: string, accentColor: string, formatDate: (date: string) => string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        @page { margin: 0.5in; size: A4; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            margin-bottom: 2rem;
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
        }
        
        .profile-img {
            width: 6rem;
            height: 6rem;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid ${primaryColor};
        }
        
        .header-content { flex: 1; }
        
        .name { 
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #111827;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: #4b5563;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .section { 
            margin-bottom: 2rem;
            break-inside: avoid;
        }
        
        .section-title { 
            font-size: 1.25rem;
            font-weight: 600;
            border-bottom: 2px solid ${primaryColor};
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            color: #111827;
        }
        
        .job, .education-item { 
            margin-bottom: 1.5rem;
            break-inside: avoid;
        }
        
        .job-header, .edu-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
        }
        
        .job-title, .degree { 
            font-weight: 600;
            font-size: 1.125rem;
            color: #111827;
        }
        
        .company, .institution { 
            color: ${primaryColor};
            font-weight: 500;
        }
        
        .location {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .date { 
            text-align: right;
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .description {
            color: #374151;
            margin-bottom: 0.75rem;
        }
        
        .achievements {
            list-style: none;
            padding: 0;
        }
        
        .achievements li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.25rem;
            color: #374151;
        }
        
        .achievements li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: ${primaryColor};
            font-weight: bold;
        }
        
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill {
            background: ${primaryColor}20;
            color: ${primaryColor};
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .summary {
            color: #374151;
            line-height: 1.7;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        ${data.personalInfo.profilePicture ? `<img src="${data.personalInfo.profilePicture}" alt="Profile" class="profile-img">` : ''}
        <div class="header-content">
            <h1 class="name">${data.personalInfo.name || 'Your Name'}</h1>
            <div class="contact-grid">
                ${data.personalInfo.email ? `<div class="contact-item"><span>📧</span><span>${data.personalInfo.email}</span></div>` : ''}
                ${data.personalInfo.phone ? `<div class="contact-item"><span>📞</span><span>${data.personalInfo.phone}</span></div>` : ''}
                ${data.personalInfo.location ? `<div class="contact-item"><span>📍</span><span>${data.personalInfo.location}</span></div>` : ''}
                ${data.personalInfo.linkedin ? `<div class="contact-item"><span>💼</span><span>${data.personalInfo.linkedin}</span></div>` : ''}
                ${data.personalInfo.website ? `<div class="contact-item"><span>🌐</span><span>${data.personalInfo.website}</span></div>` : ''}
            </div>
        </div>
    </div>
    
    ${data.summary ? `<div class="section"><h2 class="section-title">Professional Summary</h2><p class="summary">${data.summary}</p></div>` : ''}
    
    ${data.experience.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        ${data.experience.map(exp => `
            <div class="job">
                <div class="job-header">
                    <div>
                        <h3 class="job-title">${exp.jobTitle}</h3>
                        <p class="company">${exp.company}</p>
                        ${exp.location ? `<p class="location">${exp.location}</p>` : ''}
                    </div>
                    <div class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                </div>
                ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                ${exp.achievements.length > 0 ? `<ul class="achievements">${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>` : ''}
            </div>
        `).join('')}
    </div>` : ''}
    
    ${data.education.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Education</h2>
        ${data.education.map(edu => `
            <div class="education-item">
                <div class="edu-header">
                    <div>
                        <h3 class="degree">${edu.degree}</h3>
                        <p class="institution">${edu.institution}</p>
                        ${edu.location ? `<p class="location">${edu.location}</p>` : ''}
                    </div>
                    <div class="date">
                        ${edu.graduationDate ? formatDate(edu.graduationDate) : ''}
                        ${edu.gpa ? `<br>GPA: ${edu.gpa}` : ''}
                    </div>
                </div>
                ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
                ${edu.achievements.length > 0 ? `<ul class="achievements">${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>` : ''}
            </div>
        `).join('')}
    </div>` : ''}
    
    ${data.skills.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills">${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}</div>
    </div>` : ''}
</body>
</html>`.trim();
  };

  // Classic Template HTML Generator
  const generateClassicHTML = (data: ResumeData, primaryColor: string, accentColor: string, formatDate: (date: string) => string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        @page { margin: 0.5in; size: A4; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid ${primaryColor};
        }
        
        .profile-img {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid ${primaryColor};
            margin-bottom: 1rem;
        }
        
        .name { 
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: ${primaryColor};
            letter-spacing: 1px;
        }
        
        .contact-info {
            font-size: 0.875rem;
            color: #4b5563;
            margin-bottom: 1rem;
        }
        
        .contact-info span {
            margin: 0 0.5rem;
        }
        
        .section { 
            margin-bottom: 2rem;
            break-inside: avoid;
        }
        
        .section-title { 
            font-size: 1.125rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: ${primaryColor};
            text-align: center;
            margin-bottom: 1rem;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid ${accentColor};
        }
        
        .job, .education-item { 
            margin-bottom: 1.5rem;
            break-inside: avoid;
            text-align: center;
        }
        
        .job-title, .degree { 
            font-weight: 700;
            font-size: 1.125rem;
            color: #111827;
            margin-bottom: 0.25rem;
        }
        
        .company, .institution { 
            color: ${primaryColor};
            font-weight: 600;
            font-style: italic;
            margin-bottom: 0.25rem;
        }
        
        .location, .date {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        
        .description {
            color: #374151;
            margin-bottom: 0.75rem;
            text-align: justify;
            font-style: italic;
        }
        
        .achievements {
            list-style: none;
            padding: 0;
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .achievements li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.25rem;
            color: #374151;
        }
        
        .achievements li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: ${primaryColor};
            font-weight: bold;
        }
        
        .skills {
            text-align: center;
        }
        
        .skills-list {
            font-size: 1rem;
            color: #374151;
            line-height: 1.8;
        }
        
        .summary {
            color: #374151;
            line-height: 1.8;
            text-align: justify;
            font-style: italic;
            max-width: 700px;
            margin: 0 auto;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        ${data.personalInfo.profilePicture ? `<img src="${data.personalInfo.profilePicture}" alt="Profile" class="profile-img">` : ''}
        <h1 class="name">${data.personalInfo.name || 'Your Name'}</h1>
        <div class="contact-info">
            ${data.personalInfo.email ? `<span>📧 ${data.personalInfo.email}</span>` : ''}
            ${data.personalInfo.phone ? `<span>📞 ${data.personalInfo.phone}</span>` : ''}
            ${data.personalInfo.location ? `<span>📍 ${data.personalInfo.location}</span>` : ''}
            ${data.personalInfo.linkedin ? `<span>💼 ${data.personalInfo.linkedin}</span>` : ''}
            ${data.personalInfo.website ? `<span>🌐 ${data.personalInfo.website}</span>` : ''}
        </div>
    </div>
    
    ${data.summary ? `<div class="section"><h2 class="section-title">Professional Summary</h2><p class="summary">${data.summary}</p></div>` : ''}
    
    ${data.experience.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        ${data.experience.map(exp => `
            <div class="job">
                <h3 class="job-title">${exp.jobTitle}</h3>
                <p class="company">${exp.company}</p>
                ${exp.location ? `<p class="location">${exp.location}</p>` : ''}
                <p class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                ${exp.achievements.length > 0 ? `<ul class="achievements">${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>` : ''}
            </div>
        `).join('')}
    </div>` : ''}
    
    ${data.education.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Education</h2>
        ${data.education.map(edu => `
            <div class="education-item">
                <h3 class="degree">${edu.degree}</h3>
                <p class="institution">${edu.institution}</p>
                ${edu.location ? `<p class="location">${edu.location}</p>` : ''}
                <p class="date">
                    ${edu.graduationDate ? formatDate(edu.graduationDate) : ''}
                    ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                </p>
                ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
                ${edu.achievements.length > 0 ? `<ul class="achievements">${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>` : ''}
            </div>
        `).join('')}
    </div>` : ''}
    
    ${data.skills.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills">
            <p class="skills-list">${data.skills.join(' • ')}</p>
        </div>
    </div>` : ''}
</body>
</html>`.trim();
  };

  // Creative Template HTML Generator
  const generateCreativeHTML = (data: ResumeData, primaryColor: string, accentColor: string, formatDate: (date: string) => string, isStarsTheme: boolean) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - Resume</title>
    <style>
        @page { margin: 0.5in; size: A4; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
            margin: 0;
            padding: 0;
        }
        
        .container {
            display: flex;
            min-height: 100vh;
            max-width: 8.5in;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
        }
        
        .background-effects {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }
        
        .gradient-orb-1 {
            position: absolute;
            top: -5rem;
            left: -5rem;
            width: 20rem;
            height: 20rem;
            border-radius: 50%;
            background: radial-gradient(circle, ${accentColor}20 0%, transparent 70%);
        }
        
        .gradient-orb-2 {
            position: absolute;
            top: 33%;
            right: -8rem;
            width: 24rem;
            height: 24rem;
            border-radius: 50%;
            background: radial-gradient(circle, ${primaryColor}15 0%, transparent 70%);
        }
        
        ${isStarsTheme ? `
        .star {
            position: absolute;
            width: 3px;
            height: 3px;
            background: #fbbf24;
            border-radius: 50%;
            animation: twinkle 2s ease-in-out infinite alternate;
        }
        
        .star-1 { top: 5rem; left: 25%; animation-delay: 0s; }
        .star-2 { top: 8rem; right: 33%; animation-delay: 0.5s; background: #fde047; }
        .star-3 { top: 50%; left: 4rem; animation-delay: 1s; }
        .star-4 { bottom: 33%; right: 5rem; animation-delay: 1.5s; background: #fde047; }
        .star-5 { bottom: 5rem; left: 33%; animation-delay: 2s; }
        .star-6 { top: 25%; right: 25%; animation-delay: 0.8s; background: white; }
        .star-7 { bottom: 25%; left: 5rem; animation-delay: 1.3s; background: white; }
        
        @keyframes twinkle {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        ` : ''}
        
        .floating-shape-1 {
            position: absolute;
            top: 5rem;
            right: 5rem;
            width: 4rem;
            height: 4rem;
            background: ${primaryColor}15;
            border-radius: 0.5rem;
            transform: rotate(45deg);
        }
        
        .floating-shape-2 {
            position: absolute;
            bottom: 8rem;
            left: 4rem;
            width: 3rem;
            height: 3rem;
            background: ${accentColor}12;
            border-radius: 50%;
        }
        
        .sidebar {
            width: 33.333%;
            background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
            color: white;
            padding: 1.5rem;
            position: relative;
            z-index: 10;
        }
        
        .profile-section {
            text-align: center;
            margin-bottom: 1.5rem;
        }
        
        .profile-img {
            width: 8rem;
            height: 8rem;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255, 255, 255, 0.3);
            margin-bottom: 1rem;
        }
        
        .sidebar-section {
            margin-bottom: 1.5rem;
        }
        
        .sidebar-title {
            font-size: 1.125rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
        }
        
        .skill-tag {
            display: block;
            padding: 0.375rem 0.75rem;
            margin-bottom: 0.5rem;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 9999px;
            text-align: center;
            font-size: 0.875rem;
        }
        
        .education-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            padding: 0.75rem;
            margin-bottom: 1rem;
        }
        
        .edu-title {
            font-weight: 600;
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
        }
        
        .edu-institution {
            font-size: 0.875rem;
            opacity: 0.9;
            margin-bottom: 0.25rem;
        }
        
        .edu-details {
            font-size: 0.75rem;
            opacity: 0.8;
        }
        
        .main-content {
            width: 66.667%;
            padding: 2rem;
            position: relative;
            z-index: 10;
        }
        
        .name {
            font-size: 2.5rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
            position: relative;
        }
        
        .name::after {
            content: '';
            position: absolute;
            bottom: -0.25rem;
            left: 0;
            width: 8rem;
            height: 0.25rem;
            background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
            border-radius: 9999px;
        }
        
        .summary-card {
            background: #f9fafb;
            border-left: 4px solid ${primaryColor};
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0 2rem 0;
        }
        
        .section {
            margin-bottom: 2rem;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .section-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            background: ${primaryColor};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${primaryColor};
        }
        
        .experience-timeline {
            position: relative;
        }
        
        .timeline-item {
            position: relative;
            display: flex;
            margin-bottom: 1.5rem;
        }
        
        .timeline-marker {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background: ${accentColor};
            margin-right: 1rem;
            margin-top: 0.5rem;
            flex-shrink: 0;
        }
        
        .timeline-line {
            position: absolute;
            left: 0.5rem;
            top: 1.5rem;
            bottom: -1.5rem;
            width: 2px;
            background: ${primaryColor}40;
        }
        
        .experience-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            flex: 1;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
        }
        
        .job-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #111827;
        }
        
        .company {
            color: ${primaryColor};
            font-weight: 600;
        }
        
        .job-location {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .job-date {
            background: ${accentColor};
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .job-description {
            color: #374151;
            margin-bottom: 0.75rem;
        }
        
        .achievements {
            list-style: none;
            padding: 0;
        }
        
        .achievements li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.25rem;
            color: #374151;
        }
        
        .achievements li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0.5rem;
            width: 0.375rem;
            height: 0.375rem;
            background: ${primaryColor};
            border-radius: 50%;
        }
        
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .section { page-break-inside: avoid; }
            .timeline-item { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="background-effects">
            <div class="gradient-orb-1"></div>
            <div class="gradient-orb-2"></div>
            ${isStarsTheme ? `
                <div class="star star-1"></div>
                <div class="star star-2"></div>
                <div class="star star-3"></div>
                <div class="star star-4"></div>
                <div class="star star-5"></div>
                <div class="star star-6"></div>
                <div class="star star-7"></div>
            ` : ''}
            <div class="floating-shape-1"></div>
            <div class="floating-shape-2"></div>
        </div>
        
        <div class="sidebar">
            <div class="profile-section">
                ${data.personalInfo.profilePicture ? `<img src="${data.personalInfo.profilePicture}" alt="Profile" class="profile-img">` : ''}
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-title">📧 Contact</h3>
                ${data.personalInfo.email ? `<div class="contact-item"><span>📧</span><span>${data.personalInfo.email}</span></div>` : ''}
                ${data.personalInfo.phone ? `<div class="contact-item"><span>📞</span><span>${data.personalInfo.phone}</span></div>` : ''}
                ${data.personalInfo.location ? `<div class="contact-item"><span>📍</span><span>${data.personalInfo.location}</span></div>` : ''}
                ${data.personalInfo.linkedin ? `<div class="contact-item"><span>💼</span><span>${data.personalInfo.linkedin}</span></div>` : ''}
                ${data.personalInfo.website ? `<div class="contact-item"><span>🌐</span><span>${data.personalInfo.website}</span></div>` : ''}
            </div>
            
            ${data.skills.length > 0 ? `
            <div class="sidebar-section">
                <h3 class="sidebar-title">🏆 Skills</h3>
                ${data.skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
            </div>` : ''}
            
            ${data.education.length > 0 ? `
            <div class="sidebar-section">
                <h3 class="sidebar-title">🎓 Education</h3>
                ${data.education.map(edu => `
                    <div class="education-card">
                        <h4 class="edu-title">${edu.degree}</h4>
                        <p class="edu-institution">${edu.institution}</p>
                        ${edu.location ? `<p class="edu-details">${edu.location}</p>` : ''}
                        ${edu.graduationDate ? `<p class="edu-details">${formatDate(edu.graduationDate)}</p>` : ''}
                        ${edu.gpa ? `<p class="edu-details">GPA: ${edu.gpa}</p>` : ''}
                    </div>
                `).join('')}
            </div>` : ''}
        </div>
        
        <div class="main-content">
            <header>
                <h1 class="name">${data.personalInfo.name || 'Your Name'}</h1>
                ${data.summary ? `<div class="summary-card"><p>${data.summary}</p></div>` : ''}
            </header>
            
            ${data.experience.length > 0 ? `
            <div class="section">
                <div class="section-header">
                    <div class="section-icon">💼</div>
                    <h2 class="section-title">Professional Experience</h2>
                </div>
                
                <div class="experience-timeline">
                    ${data.experience.map((exp, index) => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            ${index < data.experience.length - 1 ? '<div class="timeline-line"></div>' : ''}
                            <div class="experience-card">
                                <div class="job-header">
                                    <div>
                                        <h3 class="job-title">${exp.jobTitle}</h3>
                                        <p class="company">${exp.company}</p>
                                        ${exp.location ? `<p class="job-location">${exp.location}</p>` : ''}
                                    </div>
                                    <div class="job-date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                                </div>
                                ${exp.description ? `<p class="job-description">${exp.description}</p>` : ''}
                                ${exp.achievements.length > 0 ? `<ul class="achievements">${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
        </div>
    </div>
</body>
</html>`.trim();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={!resumeData}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToDOCX}>
          <File className="h-4 w-4 mr-2" />
          Export as RTF/Word
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToHTML}>
          <Globe className="h-4 w-4 mr-2" />
          Export as HTML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}