import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Lightbulb,
  Star,
  Zap,
  Shield,
  Heart
} from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    title: "Welcome to AI Resume Builder! 🎉",
    content: "We're here to help you create an amazing resume, even if you've never done this before!",
    icon: <Heart className="h-8 w-8 text-red-500" />,
    color: "from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900",
    tips: [
      "This is completely free to use",
      "No experience needed - we'll guide you",
      "Takes about 10-15 minutes to complete"
    ]
  },
  {
    title: "Step-by-Step Guidance 📝",
    content: "Our builder breaks everything down into simple steps so you're never overwhelmed.",
    icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
    color: "from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900",
    tips: [
      "We'll tell you exactly what to write",
      "Helpful tips and examples for every section",
      "Visual progress tracking so you know how you're doing"
    ]
  },
  {
    title: "AI-Powered Help 🤖",
    content: "Stuck on what to write? Our AI can generate professional content for you!",
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    color: "from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900",
    tips: [
      "AI generates professional summaries and bullet points",
      "Tailored suggestions based on your job title",
      "Always editable - you have full control"
    ]
  },
  {
    title: "Professional Results 🌟",
    content: "Get a resume that looks great and passes through applicant tracking systems!",
    icon: <Shield className="h-8 w-8 text-green-500" />,
    color: "from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900",
    tips: [
      "ATS-optimized formatting",
      "Multiple professional templates",
      "Download as PDF, Word, or HTML"
    ]
  },
  {
    title: "Ready to Start? 🚀",
    content: "You've got this! Remember, we're here to help every step of the way.",
    icon: <Star className="h-8 w-8 text-purple-500" />,
    color: "from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900",
    tips: [
      "Start with personal information (easiest part!)",
      "Use the AI help buttons whenever you need them",
      "Preview your resume anytime to see how it looks"
    ]
  }
];

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTour = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-0 shadow-2xl">
        <CardHeader className={`bg-gradient-to-r ${currentTour.color} relative`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-4 right-4 hover:bg-white/50 dark:hover:bg-gray-800/50"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                {currentTour.icon}
              </div>
              <div>
                <CardTitle className="text-2xl">{currentTour.title}</CardTitle>
                <Badge variant="secondary" className="mt-2 bg-white/20 text-gray-700 dark:text-gray-300">
                  Step {currentStep + 1} of {tourSteps.length}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {currentTour.content}
          </p>
          
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <strong className="text-blue-700 dark:text-blue-300">What you'll love:</strong>
                <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                  {currentTour.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-blue-500 scale-125' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip Tour
              </Button>
              
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2"
              >
                <span>{currentStep === tourSteps.length - 1 ? 'Start Building!' : 'Next'}</span>
                {currentStep === tourSteps.length - 1 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}