import { useState } from 'react';
import { TextField, SectionHeader, AddButton, RemoveButton } from './FormField';
import { EMPTY_EDUCATION, EMPTY_CERTIFICATION } from '../../utils/resume/constants';

const StepEducation = ({ data, errors, updateField, clearSection }) => {
  const [achievementInput, setAchievementInput] = useState('');

  /* ---------- Education ---------- */
  const addEducation = () => {
    updateField('education', null, [...data.education, { ...EMPTY_EDUCATION }]);
  };

  const removeEducation = (idx) => {
    updateField('education', null, data.education.filter((_, i) => i !== idx));
  };

  const setEdu = (idx, field, value) => {
    const updated = data.education.map((edu, i) =>
      i === idx ? { ...edu, [field]: value } : edu
    );
    updateField('education', null, updated);
  };

  /* ---------- Certifications ---------- */
  const addCertification = () => {
    updateField('certifications', null, [...data.certifications, { ...EMPTY_CERTIFICATION }]);
  };

  const removeCertification = (idx) => {
    updateField('certifications', null, data.certifications.filter((_, i) => i !== idx));
  };

  const setCert = (idx, field, value) => {
    const updated = data.certifications.map((cert, i) =>
      i === idx ? { ...cert, [field]: value } : cert
    );
    updateField('certifications', null, updated);
  };

  /* ---------- Achievements ---------- */
  const addAchievement = () => {
    const trimmed = achievementInput.trim();
    if (trimmed) {
      updateField('achievements', null, [...data.achievements, trimmed]);
      setAchievementInput('');
    }
  };

  const removeAchievement = (idx) => {
    updateField('achievements', null, data.achievements.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* ========== EDUCATION ========== */}
      <div>
        <SectionHeader onClear={() => clearSection('education')} sectionName="Education">
          Education
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-5">
          Add your highest degree first. Include GPA if it strengthens your profile.
        </p>

        {data.education.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm mb-3">No education entries yet</p>
            <AddButton onClick={addEducation}>Add Education</AddButton>
          </div>
        )}

        {data.education.map((edu, idx) => (
          <div
            key={idx}
            className="relative border border-gray-200 rounded-xl p-4 sm:p-5 mb-4 bg-gray-50/50"
          >
            <div className="absolute right-3 top-3">
              <RemoveButton onClick={() => removeEducation(idx)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <TextField
                label="Degree / Program"
                value={edu.degree}
                onChange={(v) => setEdu(idx, 'degree', v)}
                error={errors[`edu_degree_${idx}`]}
                placeholder="B.Tech in Computer Science"
                required
              />
              <TextField
                label="Institution"
                value={edu.institution}
                onChange={(v) => setEdu(idx, 'institution', v)}
                error={errors[`edu_institution_${idx}`]}
                placeholder="IIT Delhi"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Year"
                value={edu.year}
                onChange={(v) => setEdu(idx, 'year', v)}
                placeholder="2020 - 2024"
              />
              <TextField
                label="GPA / Grade"
                value={edu.gpa}
                onChange={(v) => setEdu(idx, 'gpa', v)}
                placeholder="8.5 / 10"
              />
            </div>
          </div>
        ))}

        {data.education.length > 0 && (
          <AddButton onClick={addEducation}>Add Another Education</AddButton>
        )}
      </div>

      {/* ========== CERTIFICATIONS ========== */}
      <div className="border-t border-gray-100 pt-6">
        <SectionHeader onClear={() => clearSection('certifications')} sectionName="Certifications">
          Certifications
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-5">
          Industry certifications strengthen your ATS score significantly.
        </p>

        {data.certifications.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm mb-3">No certifications yet</p>
            <AddButton onClick={addCertification}>Add Certification</AddButton>
          </div>
        )}

        {data.certifications.map((cert, idx) => (
          <div
            key={idx}
            className="relative border border-gray-200 rounded-xl p-4 sm:p-5 mb-4 bg-gray-50/50"
          >
            <div className="absolute right-3 top-3">
              <RemoveButton onClick={() => removeCertification(idx)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextField
                label="Certification Name"
                value={cert.name}
                onChange={(v) => setCert(idx, 'name', v)}
                placeholder="AWS Cloud Practitioner"
              />
              <TextField
                label="Issuer"
                value={cert.issuer}
                onChange={(v) => setCert(idx, 'issuer', v)}
                placeholder="Amazon Web Services"
              />
              <TextField
                label="Year"
                value={cert.year}
                onChange={(v) => setCert(idx, 'year', v)}
                placeholder="2024"
              />
            </div>
          </div>
        ))}

        {data.certifications.length > 0 && (
          <AddButton onClick={addCertification}>Add Another Certification</AddButton>
        )}
      </div>

      {/* ========== ACHIEVEMENTS ========== */}
      <div className="border-t border-gray-100 pt-6">
        <SectionHeader onClear={() => clearSection('achievements')} sectionName="Achievements">
          Achievements
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-4">
          Notable awards, recognitions, or accomplishments.
        </p>

        {data.achievements.length > 0 && (
          <ul className="space-y-2 mb-4">
            {data.achievements.map((ach, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-sm text-gray-700">{ach}</span>
                <RemoveButton onClick={() => removeAchievement(idx)} />
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={achievementInput}
            onChange={(e) => setAchievementInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addAchievement();
              }
            }}
            placeholder="e.g. Dean's List 2023, Hackathon Winner..."
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm
              focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={addAchievement}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium
              hover:bg-emerald-700 transition-colors shrink-0"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepEducation;
