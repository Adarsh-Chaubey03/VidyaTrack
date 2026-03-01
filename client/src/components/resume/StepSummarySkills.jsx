import { useState, useCallback } from 'react';
import { TextArea, SectionHeader } from './FormField';

const StepSummarySkills = ({ data, errors, updateField, clearSection }) => {
  const [skillInput, setSkillInput] = useState('');

  const wordCount = data.summary?.trim().split(/\s+/).filter(Boolean).length || 0;

  const addSkill = useCallback(() => {
    const trimmed = skillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      updateField('skills', null, [...data.skills, trimmed]);
    }
    setSkillInput('');
  }, [skillInput, data.skills, updateField]);

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
    if (e.key === 'Backspace' && !skillInput && data.skills.length > 0) {
      updateField('skills', null, data.skills.slice(0, -1));
    }
  };

  const removeSkill = (skill) => {
    updateField('skills', null, data.skills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Summary */}
      <div>
        <SectionHeader onClear={() => clearSection('summary')} sectionName="Professional Summary">
          Professional Summary
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-4">
          Write a concise summary highlighting your key strengths and career objectives.
          ATS systems weight this section heavily.
        </p>
        <TextArea
          value={data.summary}
          onChange={(v) => updateField('summary', null, v)}
          error={errors.summary}
          placeholder="Results-driven software engineer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about clean code and user-centric design..."
          rows={5}
          required
          helperText={`${wordCount}/100 words${
            wordCount > 0 && wordCount < 30 ? ' — aim for 30+ words' : ''
          }`}
        />
      </div>

      {/* Skills */}
      <div className="border-t border-gray-100 pt-5">
        <SectionHeader onClear={() => clearSection('skills')} sectionName="Skills">
          Skills
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-4">
          Add relevant technical and soft skills. Use keywords from job descriptions
          for higher ATS compatibility. Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">,</kbd> to add.
        </p>

        {/* Tags display */}
        <div className="min-h-[52px] p-2.5 rounded-lg border border-gray-300 bg-white
          focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500
          flex flex-wrap gap-2 items-start transition-colors">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700
                rounded-md text-sm font-medium border border-emerald-200"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-emerald-400 hover:text-red-500 transition-colors ml-0.5"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            onBlur={addSkill}
            placeholder={data.skills.length === 0 ? 'e.g. React, Python, Project Management...' : 'Add more...'}
            className="flex-1 min-w-[140px] py-1 px-1 text-sm outline-none bg-transparent"
          />
        </div>
        {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills}</p>}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {data.skills.length} skill{data.skills.length !== 1 ? 's' : ''} added
          </span>
          {data.skills.length > 0 && data.skills.length < 8 && (
            <span className="text-xs text-amber-500">
              — Add {8 - data.skills.length} more for best ATS results
            </span>
          )}
          {data.skills.length >= 8 && (
            <span className="text-xs text-emerald-500">&#10003; Great skill count!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepSummarySkills;
