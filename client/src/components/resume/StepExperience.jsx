import { TextField, TextArea, CheckboxField, SectionHeader, AddButton, RemoveButton } from './FormField';
import { EMPTY_EXPERIENCE, EMPTY_PROJECT } from '../../utils/resume/constants';

const StepExperience = ({ data, errors, updateField, clearSection }) => {
  /* ---------- Experience helpers ---------- */
  const addExperience = () => {
    updateField('experience', null, [...data.experience, { ...EMPTY_EXPERIENCE }]);
  };

  const removeExperience = (idx) => {
    updateField('experience', null, data.experience.filter((_, i) => i !== idx));
  };

  const setExp = (idx, field, value) => {
    const updated = data.experience.map((exp, i) =>
      i === idx ? { ...exp, [field]: value } : exp
    );
    updateField('experience', null, updated);
  };

  /* ---------- Project helpers ---------- */
  const addProject = () => {
    updateField('projects', null, [...data.projects, { ...EMPTY_PROJECT }]);
  };

  const removeProject = (idx) => {
    updateField('projects', null, data.projects.filter((_, i) => i !== idx));
  };

  const setProj = (idx, field, value) => {
    const updated = data.projects.map((proj, i) =>
      i === idx ? { ...proj, [field]: value } : proj
    );
    updateField('projects', null, updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* ========== EXPERIENCE ========== */}
      <div>
        <SectionHeader onClear={() => clearSection('experience')} sectionName="Work Experience">
          Work Experience
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-5">
          Add your work history, internships, or freelance roles. Use action verbs in descriptions.
          Each bullet on a new line.
        </p>

        {data.experience.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm mb-3">No experience entries yet</p>
            <AddButton onClick={addExperience}>Add Experience</AddButton>
          </div>
        )}

        {data.experience.map((exp, idx) => (
          <div
            key={idx}
            className="relative border border-gray-200 rounded-xl p-4 sm:p-5 mb-4 bg-gray-50/50"
          >
            <div className="absolute right-3 top-3">
              <RemoveButton onClick={() => removeExperience(idx)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <TextField
                label="Role / Title"
                value={exp.role}
                onChange={(v) => setExp(idx, 'role', v)}
                error={errors[`exp_role_${idx}`]}
                placeholder="Software Engineer"
                required
              />
              <TextField
                label="Company"
                value={exp.company}
                onChange={(v) => setExp(idx, 'company', v)}
                error={errors[`exp_company_${idx}`]}
                placeholder="Google"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 items-end">
              <TextField
                label="Start Date"
                value={exp.startDate}
                onChange={(v) => setExp(idx, 'startDate', v)}
                placeholder="Jan 2023"
              />
              <TextField
                label="End Date"
                value={exp.endDate}
                onChange={(v) => setExp(idx, 'endDate', v)}
                placeholder="Dec 2024"
                className={exp.current ? 'opacity-50 pointer-events-none' : ''}
              />
              <CheckboxField
                label="Currently working here"
                checked={exp.current}
                onChange={(v) => setExp(idx, 'current', v)}
              />
            </div>

            <TextArea
              label="Description"
              value={exp.description}
              onChange={(v) => setExp(idx, 'description', v)}
              placeholder={"Led migration of legacy monolith to microservices\nReduced API response time by 40%\nMentored 3 junior developers on React best practices"}
              rows={4}
              helperText="One bullet point per line — start with action verbs (Led, Built, Designed...)"
            />
          </div>
        ))}

        {data.experience.length > 0 && (
          <AddButton onClick={addExperience}>Add Another Experience</AddButton>
        )}
      </div>

      {/* ========== PROJECTS ========== */}
      <div className="border-t border-gray-100 pt-6">
        <SectionHeader onClear={() => clearSection('projects')} sectionName="Projects">
          Projects
        </SectionHeader>
        <p className="text-sm text-gray-500 -mt-2 mb-5">
          Showcase your personal or team projects. Include the tech stack and outcomes.
        </p>

        {data.projects.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm mb-3">No projects yet</p>
            <AddButton onClick={addProject}>Add Project</AddButton>
          </div>
        )}

        {data.projects.map((proj, idx) => (
          <div
            key={idx}
            className="relative border border-gray-200 rounded-xl p-4 sm:p-5 mb-4 bg-gray-50/50"
          >
            <div className="absolute right-3 top-3">
              <RemoveButton onClick={() => removeProject(idx)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <TextField
                label="Project Name"
                value={proj.name}
                onChange={(v) => setProj(idx, 'name', v)}
                error={errors[`proj_name_${idx}`]}
                placeholder="E-Commerce Platform"
                required
              />
              <TextField
                label="Technologies Used"
                value={proj.technologies}
                onChange={(v) => setProj(idx, 'technologies', v)}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <TextField
              label="Project Link"
              value={proj.link}
              onChange={(v) => setProj(idx, 'link', v)}
              placeholder="https://github.com/username/project"
              className="mb-4"
            />

            <TextArea
              label="Description"
              value={proj.description}
              onChange={(v) => setProj(idx, 'description', v)}
              placeholder="Built a full-stack e-commerce platform with user auth, product catalog, Stripe payments, and an admin dashboard. Handles 1000+ concurrent users."
              rows={3}
            />
          </div>
        ))}

        {data.projects.length > 0 && (
          <AddButton onClick={addProject}>Add Another Project</AddButton>
        )}
      </div>
    </div>
  );
};

export default StepExperience;
