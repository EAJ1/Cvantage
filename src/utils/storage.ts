export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  profilePicture?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  description?: string;
  achievements: string[];
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  isDarkMode: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  selectedTemplate: string;
  themeSettings: ThemeSettings;
}

const STORAGE_KEY = 'ai-resume-builder-data';
const THEME_KEY = 'ai-resume-builder-theme';

export const defaultThemeSettings: ThemeSettings = {
  primaryColor: '#2563eb',
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  isDarkMode: false
};

export const loadResumeData = (): ResumeData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure themeSettings exists for backward compatibility
      if (!data.themeSettings) {
        data.themeSettings = defaultThemeSettings;
      }
      return data;
    }
  } catch (error) {
    console.error('Error loading resume data:', error);
  }
  
  return {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    selectedTemplate: 'modern',
    themeSettings: defaultThemeSettings
  };
};

export const saveResumeData = (data: ResumeData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving resume data:', error);
  }
};

export const loadThemeSettings = (): ThemeSettings => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading theme settings:', error);
  }
  return defaultThemeSettings;
};

export const saveThemeSettings = (settings: ThemeSettings): void => {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(settings));
    // Apply dark mode class to document
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (error) {
    console.error('Error saving theme settings:', error);
  }
};

export const clearResumeData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing resume data:', error);
  }
};