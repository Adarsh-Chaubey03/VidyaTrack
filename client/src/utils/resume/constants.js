// Resume system constants and default data

export const STEPS = [
  { id: 1, title: 'Personal Info', shortTitle: 'Personal' },
  { id: 2, title: 'Summary & Skills', shortTitle: 'Skills' },
  { id: 3, title: 'Experience', shortTitle: 'Experience' },
  { id: 4, title: 'Education & More', shortTitle: 'Education' },
  { id: 5, title: 'Preview & Download', shortTitle: 'Preview' },
];

export const INDUSTRIES = [
  'Technology & Software',
  'Data Science & Analytics',
  'Finance & Banking',
  'Healthcare & Pharma',
  'Education & EdTech',
  'Marketing & Advertising',
  'Engineering & Manufacturing',
  'Design & Creative',
  'Sales & Business Development',
  'Operations & Supply Chain',
  'Consulting & Strategy',
  'Legal & Compliance',
  'Human Resources',
  'Media & Communications',
  'Other',
];

export const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher (0-1 years)' },
  { value: 'mid', label: 'Mid-Level (1-3 years)' },
  { value: 'senior', label: 'Senior (3+ years)' },
];

export const DEFAULT_RESUME = {
  personal: {
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    github: '',
    linkedin: '',
  },
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  achievements: [],
};

export const EMPTY_EXPERIENCE = {
  role: '',
  company: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

export const EMPTY_PROJECT = {
  name: '',
  description: '',
  technologies: '',
  link: '',
};

export const EMPTY_EDUCATION = {
  degree: '',
  institution: '',
  year: '',
  gpa: '',
};

export const EMPTY_CERTIFICATION = {
  name: '',
  issuer: '',
  year: '',
};

export const STORAGE_KEY = 'vidyatrack-resume-draft';
export const REVIEW_STORAGE_KEY = 'vidyatrack-resume-reviews';
