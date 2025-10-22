import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Sparkles, Loader2 } from 'lucide-react';

interface AIContentGeneratorProps {
  type: 'summary' | 'bullet' | 'skills';
  context: {
    jobTitle?: string;
    company?: string;
    industry?: string;
  };
  onGenerate: (content: string) => void;
}

export function AIContentGenerator({ type, context, onGenerate }: AIContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let content = '';
    
    switch (type) {
      case 'summary':
        content = generateSummary(context);
        break;
      case 'bullet':
        content = generateBulletPoint(context);
        break;
      case 'skills':
        content = generateSkills(context);
        break;
    }
    
    setIsGenerating(false);
    onGenerate(content);
  };

  const generateSummary = (context: any) => {
    const summaries = [
      `Results-driven ${context.jobTitle || 'professional'} with extensive experience in ${context.industry || 'technology'} sector. Proven track record of delivering high-quality solutions and driving business growth through innovative approaches and strategic thinking.`,
      `Experienced ${context.jobTitle || 'professional'} with a passion for excellence and continuous improvement. Skilled in leading cross-functional teams and implementing scalable solutions that drive organizational success.`,
      `Dynamic ${context.jobTitle || 'professional'} with strong analytical and problem-solving skills. Committed to delivering exceptional results through collaborative leadership and innovative technology solutions.`
    ];
    
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  const generateBulletPoint = (context: any) => {
    const bullets = [
      `Led development of innovative solutions that improved system performance by 40% and reduced operational costs`,
      `Collaborated with cross-functional teams to deliver high-impact projects on time and within budget`,
      `Implemented best practices and quality assurance processes that increased team productivity by 35%`,
      `Mentored junior team members and facilitated knowledge sharing across departments`,
      `Designed and executed strategic initiatives that resulted in significant business growth and customer satisfaction`,
      `Optimized workflows and processes through automation, reducing manual effort by 50%`,
      `Spearheaded the adoption of new technologies that enhanced product capabilities and user experience`
    ];
    
    return bullets[Math.floor(Math.random() * bullets.length)];
  };

  const generateSkills = (context: any) => {
    const skillSets = {
      'Software Engineer': ['JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS'],
      'Data Scientist': ['Python, R, SQL, Machine Learning, TensorFlow, Pandas, Visualization, Statistics'],
      'Product Manager': ['Product Strategy, Roadmap Planning, Agile, Stakeholder Management, Analytics, UX Design'],
      'Marketing Manager': ['Digital Marketing, SEO, SEM, Content Strategy, Analytics, Brand Management'],
      'Business Analyst': ['Requirements Analysis, Process Improvement, SQL, Excel, Power BI, Stakeholder Management']
    };
    
    const defaultSkills = 'Communication, Leadership, Problem Solving, Project Management, Critical Thinking, Teamwork';
    
    return skillSets[context.jobTitle as keyof typeof skillSets] || defaultSkills;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generateContent}
      disabled={isGenerating}
      className="flex items-center gap-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {isGenerating ? 'Generating...' : 'AI Generate'}
    </Button>
  );
}