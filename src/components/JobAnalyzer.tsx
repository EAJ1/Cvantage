import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Target, TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { ResumeData } from '../utils/storage';

interface JobAnalyzerProps {
  resumeData: ResumeData | null;
}

interface AnalysisResult {
  overallScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  improvements: string[];
}

export function JobAnalyzer({ resumeData }: JobAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJobMatch = async () => {
    if (!resumeData || !jobDescription.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis logic
    const result = performMockAnalysis(resumeData, jobDescription);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const performMockAnalysis = (resume: ResumeData, jobDesc: string): AnalysisResult => {
    // Extract keywords from job description (simplified)
    const jobKeywords = extractKeywords(jobDesc.toLowerCase());
    
    // Extract keywords from resume
    const resumeText = [
      resume.summary,
      ...resume.experience.map(exp => `${exp.jobTitle} ${exp.description} ${exp.achievements.join(' ')}`),
      ...resume.education.map(edu => `${edu.degree} ${edu.description} ${edu.achievements.join(' ')}`),
      ...resume.skills
    ].join(' ').toLowerCase();
    
    const resumeKeywords = extractKeywords(resumeText);
    
    // Find matching and missing keywords
    const matchingKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(resumeKeyword => resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword))
    );
    
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.some(resumeKeyword => resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword))
    );
    
    // Calculate score
    const overallScore = Math.min(95, Math.max(45, (matchingKeywords.length / Math.max(jobKeywords.length, 1)) * 100 + 20));
    
    return {
      overallScore: Math.round(overallScore),
      matchingKeywords: matchingKeywords.slice(0, 8),
      missingKeywords: missingKeywords.slice(0, 6),
      suggestions: generateSuggestions(missingKeywords),
      strengths: generateStrengths(matchingKeywords),
      improvements: generateImprovements(missingKeywords)
    };
  };

  const extractKeywords = (text: string): string[] => {
    // Simple keyword extraction (in a real app, you'd use NLP libraries)
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    return text
      .split(/\W+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index)
      .slice(0, 20);
  };

  const generateSuggestions = (missingKeywords: string[]): string[] => {
    const suggestions = [
      'Add relevant technical skills to your skills section',
      'Include industry-specific keywords in your experience descriptions',
      'Quantify your achievements with specific metrics and numbers',
      'Tailor your professional summary to match the job requirements',
      'Use action verbs that align with the job posting language'
    ];
    
    if (missingKeywords.length > 0) {
      suggestions.unshift(`Consider including keywords like: ${missingKeywords.slice(0, 3).join(', ')}`);
    }
    
    return suggestions.slice(0, 5);
  };

  const generateStrengths = (matchingKeywords: string[]): string[] => {
    return [
      'Strong keyword alignment with job requirements',
      'Relevant experience matches job description',
      'Technical skills align with position needs',
      'Professional background fits the role'
    ];
  };

  const generateImprovements = (missingKeywords: string[]): string[] => {
    return [
      'Add more industry-specific terminology',
      'Include relevant certifications or training',
      'Expand on technical accomplishments',
      'Improve keyword density in experience section'
    ];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="flex items-center justify-center gap-2 mb-4">
          <Target className="h-6 w-6" />
          Job Match Analyzer
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Paste a job description below to analyze how well your resume matches the requirements.
          Get insights on keyword optimization and ATS compatibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={12}
                className="resize-none"
              />
              <div className="mt-4">
                <Button 
                  onClick={analyzeJobMatch}
                  disabled={!resumeData || !jobDescription.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Job Match'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {!resumeData ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3>No Resume Data</h3>
                <p className="text-muted-foreground">
                  Please create a resume first using the Resume Builder to analyze job matches.
                </p>
              </CardContent>
            </Card>
          ) : !analysisResult ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3>Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Paste a job description and click "Analyze Job Match" to get detailed insights.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Match Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{analysisResult.overallScore}%</span>
                      <Badge 
                        variant={analysisResult.overallScore >= 80 ? 'default' : 
                                analysisResult.overallScore >= 60 ? 'secondary' : 'destructive'}
                      >
                        {analysisResult.overallScore >= 80 ? 'Excellent' : 
                         analysisResult.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    <Progress value={analysisResult.overallScore} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Keywords Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-sm">Matching Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.matchingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-sm">Missing Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {analysisResult && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>ATS Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {analysisResult.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}