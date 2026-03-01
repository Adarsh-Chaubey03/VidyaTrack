// Lightweight ATS scoring engine

/**
 * Calculates an ATS compatibility score (0-100) for a resume.
 * Checks for completeness, keyword density, structure compliance.
 */
export const calculateATSScore = (resume) => {
  let score = 0;
  const tips = [];
  const breakdown = {};

  // 1. Contact completeness (10 pts)
  const { personal } = resume;
  const contactFields = [personal.name, personal.email, personal.phone].filter(
    (f) => f?.trim()
  );
  const contactScore = Math.round((contactFields.length / 3) * 10);
  score += contactScore;
  breakdown.contact = contactScore;
  if (contactScore < 10) tips.push('Complete all contact fields (name, email, phone)');

  // 2. Professional summary (15 pts)
  const wordCount = resume.summary?.trim().split(/\s+/).filter(Boolean).length || 0;
  let summaryScore = 0;
  if (wordCount >= 30 && wordCount <= 100) {
    summaryScore = 15;
  } else if (wordCount >= 15) {
    summaryScore = 10;
    tips.push('Expand your summary to 30-100 words for best ATS results');
  } else if (wordCount > 0) {
    summaryScore = 5;
    tips.push('Your summary is too short — aim for 30-100 words');
  } else {
    tips.push('Add a professional summary to improve your ATS score');
  }
  score += summaryScore;
  breakdown.summary = summaryScore;

  // 3. Skills (15 pts)
  const skillCount = resume.skills?.length || 0;
  let skillsScore = 0;
  if (skillCount >= 8) {
    skillsScore = 15;
  } else if (skillCount >= 5) {
    skillsScore = 10;
    tips.push('Add more skills (8+ recommended for best ATS match)');
  } else if (skillCount >= 1) {
    skillsScore = 5;
    tips.push('Add more relevant skills — aim for at least 8');
  } else {
    tips.push('Add your key skills — this is critical for ATS parsing');
  }
  score += skillsScore;
  breakdown.skills = skillsScore;

  // 4. Experience (20 pts)
  const expCount = resume.experience?.filter((e) => e.role?.trim()).length || 0;
  const hasDetailedExp = resume.experience?.some(
    (e) => e.description?.trim().length > 30
  );
  let expScore = 0;
  if (expCount >= 2) expScore += 10;
  else if (expCount === 1) {
    expScore += 6;
    tips.push('Add more work experience entries if applicable');
  } else {
    tips.push('Add your work experience — even internships count');
  }
  if (hasDetailedExp) expScore += 5;
  else if (expCount > 0)
    tips.push('Add detailed bullet points to your experience descriptions');
  if (expCount > 0 && resume.experience.some((e) => e.startDate))
    expScore += 5;
  else if (expCount > 0) tips.push('Include dates for each experience entry');
  score += Math.min(expScore, 20);
  breakdown.experience = Math.min(expScore, 20);

  // 5. Projects (10 pts)
  const projCount = resume.projects?.filter((p) => p.name?.trim()).length || 0;
  let projScore = 0;
  if (projCount >= 2) {
    projScore = 10;
  } else if (projCount === 1) {
    projScore = 6;
    tips.push('Add another project to showcase your practical skills');
  } else {
    tips.push('Add projects to demonstrate your hands-on experience');
  }
  score += projScore;
  breakdown.projects = projScore;

  // 6. Education (15 pts)
  const eduCount = resume.education?.filter((e) => e.degree?.trim()).length || 0;
  let eduScore = 0;
  if (eduCount >= 1) {
    eduScore = 15;
  } else {
    tips.push('Add your education details');
  }
  score += eduScore;
  breakdown.education = eduScore;

  // 7. Certifications (5 pts)
  const certCount = resume.certifications?.filter((c) => c.name?.trim()).length || 0;
  let certScore = 0;
  if (certCount >= 1) {
    certScore = 5;
  } else {
    tips.push('Add relevant certifications to boost your credibility');
  }
  score += certScore;
  breakdown.certifications = certScore;

  // 8. Achievements (5 pts)
  const achCount = resume.achievements?.filter((a) => a?.trim()).length || 0;
  let achScore = 0;
  if (achCount >= 1) {
    achScore = 5;
  } else {
    tips.push('Include notable achievements or awards');
  }
  score += achScore;
  breakdown.achievements = achScore;

  // 9. Links (5 pts)
  let linksScore = 0;
  if (personal.github?.trim() || personal.linkedin?.trim()) {
    linksScore = 5;
  } else {
    tips.push('Add your GitHub or LinkedIn profile link');
  }
  score += linksScore;
  breakdown.links = linksScore;

  // Grade
  let grade;
  if (score >= 85) grade = 'Excellent';
  else if (score >= 70) grade = 'Good';
  else if (score >= 50) grade = 'Fair';
  else grade = 'Needs Work';

  return { score, tips: tips.slice(0, 5), breakdown, grade };
};
