import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Lightbulb,
  Star,
  CheckCircle,
  Clock,
  Users,
  Zap
} from 'lucide-react';

interface HelpPanelProps {
  currentStep: string;
}

const stepHelp = {
  personal: {
    title: "Personal Information Tips 📝",
    mainTip: "This is the easiest part! Just fill in your basic contact details.",
    tips: [
      "Use your real name as it appears on official documents",
      "Professional email only (no nicknames or funny addresses)",
      "Phone number with area code is perfect",
      "City and state/country is enough for location"
    ],
    timeEstimate: "2-3 minutes",
    examples: [
      "Good email: john.smith@email.com",
      "Avoid: coolkid2023@email.com"
    ]
  },
  summary: {
    title: "Professional Summary Help ✨",
    mainTip: "Think of this as your elevator pitch - what makes you awesome?",
    tips: [
      "2-3 sentences describing your best qualities",
      "Include your years of experience if you have any",
      "Mention your career goals or what you're passionate about",
      "Use the AI helper if you're stuck!"
    ],
    timeEstimate: "5-7 minutes",
    examples: [
      "Recent graduate passionate about web development...",
      "Experienced manager with 5+ years in retail..."
    ]
  },
  experience: {
    title: "Work Experience Made Easy 💼",
    mainTip: "List your jobs starting with the most recent. Include ANY work experience!",
    tips: [
      "Include part-time jobs, internships, volunteering",
      "Focus on what you achieved, not just what you did",
      "Use action words: 'managed', 'created', 'improved'",
      "Numbers make it better: 'served 100+ customers daily'"
    ],
    timeEstimate: "8-12 minutes",
    examples: [
      "Instead of: 'Worked at store'",
      "Try: 'Provided customer service to 50+ daily customers'"
    ]
  },
  education: {
    title: "Education Section Guide 🎓",
    mainTip: "Include your highest degree first, but any education counts!",
    tips: [
      "High school is fine if it's your highest level",
      "Include relevant coursework or projects",
      "GPA only if it's 3.5 or higher",
      "Certificates and online courses count too!"
    ],
    timeEstimate: "3-5 minutes",
    examples: [
      "Bachelor of Science in Computer Science",
      "High School Diploma - Honor Roll"
    ]
  },
  skills: {
    title: "Skills That Shine ⭐",
    mainTip: "Include both technical skills AND soft skills that make you great!",
    tips: [
      "Technical: software, tools, programming languages",
      "Soft skills: communication, leadership, teamwork",
      "Think about what the job you want requires",
      "Be honest - only include skills you actually have"
    ],
    timeEstimate: "3-4 minutes",
    examples: [
      "Technical: Microsoft Office, Python, Photoshop",
      "Soft: Public Speaking, Problem Solving, Time Management"
    ]
  },
  preview: {
    title: "Final Review Time! 🎉",
    mainTip: "You're almost done! Take a moment to review everything.",
    tips: [
      "Check for any typos or mistakes",
      "Make sure all dates are correct",
      "Ensure your contact info is accurate",
      "Preview how it looks to employers"
    ],
    timeEstimate: "2-3 minutes",
    examples: [
      "Common mistakes: wrong email, typos in company names",
      "Pro tip: Read it out loud to catch errors"
    ]
  }
};

export function HelpPanel({ currentStep }: HelpPanelProps) {
  const help = stepHelp[currentStep as keyof typeof stepHelp];
  
  if (!help) return null;

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
          <Lightbulb className="h-5 w-5" />
          <span>{help.title}</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            {help.timeEstimate}
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-600">
            <Users className="h-3 w-3 mr-1" />
            Beginner Friendly
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <Star className="h-4 w-4" />
          <AlertDescription>
            <strong className="text-green-700 dark:text-green-300">Key Point:</strong> {help.mainTip}
          </AlertDescription>
        </Alert>
        
        <div>
          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Helpful Tips:
          </h4>
          <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
            {help.tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
        
        {help.examples && (
          <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Examples:
            </h4>
            <div className="space-y-1 text-sm">
              {help.examples.map((example, index) => (
                <p key={index} className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 p-2 rounded">
                  {example}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}