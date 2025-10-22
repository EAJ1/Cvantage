import React from 'react';
import { User } from 'lucide-react';
import { ResumeData } from '../../utils/storage';

interface TemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: TemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const primaryColor = data.themeSettings?.primaryColor || '#374151';
  const accentColor = data.themeSettings?.accentColor || '#6b7280';

  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto font-serif">
      {/* Header */}
      <header className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: primaryColor }}>
        {data.personalInfo.profilePicture && (
          <img
            src={data.personalInfo.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2"
            style={{ borderColor: primaryColor }}
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.name || 'Your Name'}</h1>
        <div className="text-sm text-gray-600 space-y-1">
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
          {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-center uppercase tracking-wide mb-3" style={{ color: primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-center italic">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-center uppercase tracking-wide mb-4" style={{ color: primaryColor }}>
            Professional Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: accentColor }}>
                <div className="mb-2">
                  <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="font-semibold text-gray-700">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                  <p className="text-sm text-gray-600 italic">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-3 text-sm">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
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
          <h2 className="text-lg font-bold text-center uppercase tracking-wide mb-4" style={{ color: primaryColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="font-semibold text-gray-700">{edu.institution}</p>
                {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                <div className="text-sm text-gray-600 italic">
                  {edu.graduationDate && <span>{formatDate(edu.graduationDate)}</span>}
                  {edu.gpa && <span> • GPA: {edu.gpa}</span>}
                </div>
                {edu.description && (
                  <p className="text-gray-700 text-sm mt-2">{edu.description}</p>
                )}
                {edu.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm mt-2">
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
          <h2 className="text-lg font-bold text-center uppercase tracking-wide mb-4" style={{ color: primaryColor }}>
            Skills
          </h2>
          <div className="text-center">
            <p className="text-gray-700">
              {data.skills.join(' • ')}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}