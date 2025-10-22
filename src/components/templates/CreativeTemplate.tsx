import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';
import { ResumeData } from '../../utils/storage';

interface TemplateProps {
  data: ResumeData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const primaryColor = data.themeSettings?.primaryColor || '#1e40af';
  const accentColor = data.themeSettings?.accentColor || '#3b82f6';
  const isStarsTheme = primaryColor === '#0f172a' || primaryColor === '#1e3a8a';

  return (
    <div className="bg-white text-gray-900 flex min-h-screen max-w-4xl mx-auto relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`
          }}
        />
        <div 
          className="absolute top-1/3 -right-32 w-96 h-96 rounded-full opacity-8"
          style={{
            background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`
          }}
        />
        
        {/* Stars for dark theme */}
        {isStarsTheme && (
          <>
            <div className="absolute top-20 left-1/4 w-1 h-1 bg-yellow-400 rounded-full opacity-80 animate-pulse" />
            <div className="absolute top-32 right-1/3 w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 left-16 w-1 h-1 bg-yellow-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/3 right-20 w-1 h-1 bg-yellow-300 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-90 animate-pulse" style={{ animationDelay: '0.8s' }} />
            <div className="absolute bottom-1/4 left-20 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1.3s' }} />
          </>
        )}
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 opacity-8">
          <div 
            className="w-16 h-16 rotate-45 rounded-lg"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
        <div className="absolute bottom-32 left-16 opacity-6">
          <div 
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Left Sidebar with Gradient */}
      <div 
        className="w-1/3 text-white p-6 relative z-10"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`
        }}
      >
        <div className="relative z-10">
          {/* Profile Photo */}
          <div className="text-center mb-6">
            {data.personalInfo.profilePicture ? (
              <div className="relative inline-block">
                <img
                  src={data.personalInfo.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-xl mx-auto">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" />
                  <p className="break-words">{data.personalInfo.email}</p>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" />
                  <p>{data.personalInfo.phone}</p>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <p>{data.personalInfo.location}</p>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4 h-4" />
                  <p className="break-words">{data.personalInfo.linkedin}</p>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4" />
                  <p className="break-words">{data.personalInfo.website}</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Skills
              </h3>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm text-center bg-white/20 border border-white/30"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </h3>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <h4 className="font-semibold text-sm">{edu.degree}</h4>
                    <p className="text-white/80 text-sm">{edu.institution}</p>
                    {edu.location && <p className="text-white/70 text-xs">{edu.location}</p>}
                    {edu.graduationDate && (
                      <p className="text-white/70 text-xs">{formatDate(edu.graduationDate)}</p>
                    )}
                    {edu.gpa && <p className="text-white/80 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8 relative z-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 relative">
            {data.personalInfo.name || 'Your Name'}
            <div 
              className="absolute -bottom-1 left-0 h-1 w-32 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`
              }}
            />
          </h1>
          {data.summary && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: primaryColor }}>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}
        </header>

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: primaryColor }}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 
                className="text-2xl font-bold"
                style={{ color: primaryColor }}
              >
                Professional Experience
              </h2>
            </div>
            
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                      {index < data.experience.length - 1 && (
                        <div 
                          className="w-0.5 h-16 mt-2"
                          style={{ backgroundColor: `${primaryColor}40` }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                            <p 
                              className="font-semibold"
                              style={{ color: primaryColor }}
                            >
                              {exp.company}
                            </p>
                            {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                          </div>
                          <div 
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: accentColor }}
                          >
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 mb-3">{exp.description}</p>
                        )}
                        {exp.achievements.length > 0 && (
                          <ul className="space-y-1 text-gray-700">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="flex items-start">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0"
                                  style={{ backgroundColor: primaryColor }}
                                />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}