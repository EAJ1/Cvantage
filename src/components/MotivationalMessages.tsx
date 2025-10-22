import React from 'react';
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { 
  Heart,
  Star,
  Trophy,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

interface MotivationalMessagesProps {
  progress: number;
  currentStep: string;
}

const progressMessages = [
  {
    range: [0, 20],
    message: "Great start! Every expert was once a beginner. You're doing amazing! 🌟",
    icon: <Star className="h-4 w-4" />,
    color: "border-blue-200 bg-blue-50 dark:bg-blue-950"
  },
  {
    range: [21, 40],
    message: "You're making excellent progress! Keep up the fantastic work! 💪",
    icon: <Zap className="h-4 w-4" />,
    color: "border-purple-200 bg-purple-50 dark:bg-purple-950"
  },
  {
    range: [41, 60],
    message: "Halfway there! Your resume is really taking shape. You should be proud! 🎯",
    icon: <Target className="h-4 w-4" />,
    color: "border-orange-200 bg-orange-50 dark:bg-orange-950"
  },
  {
    range: [61, 80],
    message: "Outstanding! You're almost done. Your future employers will be impressed! ✨",
    icon: <Sparkles className="h-4 w-4" />,
    color: "border-green-200 bg-green-50 dark:bg-green-950"
  },
  {
    range: [81, 100],
    message: "Incredible work! You've built an amazing resume. Time to celebrate! 🎉",
    icon: <Trophy className="h-4 w-4" />,
    color: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
  }
];

const stepEncouragement = {
  personal: [
    "This is the easiest part - you've got this! 😊",
    "Just your basic info - nothing scary here! 👍",
    "Perfect start! You're building something great! 🌟"
  ],
  summary: [
    "Think of this as telling your story - make it shine! ✨",
    "Don't worry about being perfect - you can always edit! 📝",
    "You have unique value to offer - let it show! 💎"
  ],
  experience: [
    "Every job matters - from babysitting to CEO! 💼",
    "Focus on what you achieved - you've done more than you think! 🏆",
    "Your experiences have prepared you for great things! 🚀"
  ],
  education: [
    "Learning never stops - celebrate what you've accomplished! 🎓",
    "Your education is an investment in yourself! 📚",
    "Knowledge is power - you're more prepared than you know! 💡"
  ],
  skills: [
    "You have more skills than you realize - think broadly! 🎯",
    "Every skill you list is a door to opportunity! 🔑",
    "Skills can be learned - you're already growing! 📈"
  ],
  preview: [
    "Look at what you've accomplished - that's YOUR resume! 🎉",
    "You should be proud of the work you've done here! 👏",
    "Your future self will thank you for this effort! 🙏"
  ]
};

export function MotivationalMessages({ progress, currentStep }: MotivationalMessagesProps) {
  const progressMessage = progressMessages.find(msg => 
    progress >= msg.range[0] && progress <= msg.range[1]
  ) || progressMessages[0];

  const stepMessages = stepEncouragement[currentStep as keyof typeof stepEncouragement] || [];
  const randomStepMessage = stepMessages[Math.floor(Math.random() * stepMessages.length)];

  return (
    <div className="space-y-4">
      {/* Progress-based message */}
      <Alert className={progressMessage.color}>
        {progressMessage.icon}
        <AlertDescription className="flex items-center justify-between">
          <span className="font-medium">{progressMessage.message}</span>
          <Badge variant="secondary" className="ml-2">
            {Math.round(progress)}% Complete
          </Badge>
        </AlertDescription>
      </Alert>
      
      {/* Step-specific encouragement */}
      {randomStepMessage && (
        <Alert className="border-pink-200 bg-pink-50 dark:bg-pink-950">
          <Heart className="h-4 w-4" />
          <AlertDescription>
            <strong>Encouragement:</strong> {randomStepMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}