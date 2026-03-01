// Form validation utilities for the resume builder

export const validatePersonal = (personal) => {
  const errors = {};

  if (!personal.name?.trim()) errors.name = 'Full name is required';
  if (!personal.email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email))
    errors.email = 'Enter a valid email address';
  if (!personal.phone?.trim()) errors.phone = 'Phone number is required';
  else if (!/^[\d\s\-+()]{7,20}$/.test(personal.phone))
    errors.phone = 'Enter a valid phone number';

  if (personal.github && !/^https?:\/\//i.test(personal.github))
    errors.github = 'Enter a valid URL (https://...)';
  if (personal.linkedin && !/^https?:\/\//i.test(personal.linkedin))
    errors.linkedin = 'Enter a valid URL (https://...)';

  return errors;
};

export const validateSummarySkills = (summary, skills) => {
  const errors = {};
  const wordCount = summary?.trim().split(/\s+/).filter(Boolean).length || 0;

  if (!summary?.trim()) errors.summary = 'Professional summary is required';
  else if (wordCount > 100)
    errors.summary = `Summary is ${wordCount} words (max 100)`;

  if (!skills || skills.length === 0)
    errors.skills = 'Add at least one skill';

  return errors;
};

export const validateExperience = (experience, projects) => {
  const errors = {};

  experience.forEach((exp, i) => {
    if (exp.role || exp.company || exp.description) {
      if (!exp.role?.trim())
        errors[`exp_role_${i}`] = 'Role is required';
      if (!exp.company?.trim())
        errors[`exp_company_${i}`] = 'Company is required';
    }
  });

  projects.forEach((proj, i) => {
    if (proj.name || proj.description) {
      if (!proj.name?.trim())
        errors[`proj_name_${i}`] = 'Project name is required';
    }
  });

  return errors;
};

export const validateEducation = (education) => {
  const errors = {};

  education.forEach((edu, i) => {
    if (edu.degree || edu.institution) {
      if (!edu.degree?.trim())
        errors[`edu_degree_${i}`] = 'Degree is required';
      if (!edu.institution?.trim())
        errors[`edu_institution_${i}`] = 'Institution is required';
    }
  });

  return errors;
};

export const validateStep = (step, data) => {
  switch (step) {
    case 1:
      return validatePersonal(data.personal);
    case 2:
      return validateSummarySkills(data.summary, data.skills);
    case 3:
      return validateExperience(data.experience, data.projects);
    case 4:
      return validateEducation(data.education);
    default:
      return {};
  }
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
