import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { ResumeData } from '../../utils/storage';

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const primaryColor = data.themeSettings?.primaryColor || '#2563eb';
  const accentColor = data.themeSettings?.accentColor || '#3b82f6';

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start gap-6">
          {data.personalInfo.profilePicture && (
            <img
              src={data.personalInfo.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: primaryColor }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.name || 'Your Name'}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {data.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{data.personalInfo.linkedin}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-2 col-span-2">
                  <Globe className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{data.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 
            className="text-xl font-semibold text-gray-900 border-b-2 pb-2 mb-4"
            style={{ borderColor: primaryColor }}
          >
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 
            className="text-xl font-semibold text-gray-900 border-b-2 pb-2 mb-4"
            style={{ borderColor: primaryColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <p className="font-medium" style={{ color: primaryColor }}>{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-3">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 
            className="text-xl font-semibold text-gray-900 border-b-2 pb-2 mb-4"
            style={{ borderColor: primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p style={{ color: primaryColor }}>{edu.institution}</p>
                    {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    {edu.graduationDate && <p>{formatDate(edu.graduationDate)}</p>}
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700 text-sm mb-2">{edu.description}</p>
                )}
                {edu.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {edu.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 
            className="text-xl font-semibold text-gray-900 border-b-2 pb-2 mb-4"
            style={{ borderColor: primaryColor }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${primaryColor}20`, 
                  color: primaryColor 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}